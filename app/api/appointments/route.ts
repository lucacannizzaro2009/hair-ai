import { NextResponse } from "next/server";
import { ADD_ONS, BUSINESS, getService } from "@/lib/catalog";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  addDays,
  buildStartAt,
  dayIndex,
  isBookableSlot,
  italianDate,
  nowRome,
  normalizeText,
  timeToMinutes,
  validDate,
} from "@/lib/server-utils";
import { enforceRateLimit } from "@/lib/server-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIVE_STATUSES = ["requested", "confirmed"];
const MAX_ADVANCE_DAYS = 365;

function jsonError(message: string, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

function validateDate(date: unknown) {
  if (typeof date !== "string" || !validDate(date)) return "La data non è valida.";
  return null;
}

function normalizeAddOns(value: unknown) {
  if (value === undefined) return [] as string[];
  if (!Array.isArray(value) || value.length > ADD_ONS.length) return null;

  const names = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => normalizeText(item));

  if (names.length !== value.length) return null;
  if (new Set(names).size !== names.length) return null;
  if (names.some((name) => !ADD_ONS.some((addon) => addon.name === name))) return null;

  return names;
}

async function fetchBusyRows(date: string) {
  const supabase = getSupabaseAdmin();

  const nextDate = addDays(date, 1);
  const startOfDay = buildStartAt(date, "00:00");
  const startOfNextDay = buildStartAt(nextDate, "00:00");

  const { data, error } = await supabase
    .from("booking_requests")
    .select("start_at,duration_minutes,status")
    .gte("start_at", startOfDay)
    .lt("start_at", startOfNextDay)
    .in("status", ACTIVE_STATUSES);

  if (error) throw error;
  return data ?? [];
}

function unavailableSlotsForDate(
  date: string,
  rows: Array<{ start_at: string; duration_minutes: number }>,
  requestedDuration?: number,
) {
  const slots: string[] = [];
  for (let minutes = BUSINESS.openMinutes; minutes <= BUSINESS.closeMinutes; minutes += 30) {
    if (requestedDuration && minutes + requestedDuration > BUSINESS.closeMinutes) continue;

    const candidateStart = new Date(buildStartAt(date, `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`));
    const candidateEnd = new Date(candidateStart.getTime() + (requestedDuration ?? 30) * 60_000);

    const collision = rows.some((row) => {
      const busyStart = new Date(row.start_at.replace(" ", "T"));
      const busyEnd = new Date(busyStart.getTime() + Number(row.duration_minutes) * 60_000);
      return candidateStart < busyEnd && candidateEnd > busyStart;
    });

    if (collision) {
      slots.push(`${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`);
    }
  }
  return slots;
}

export async function GET(request: Request) {
  try {
    const allowed = await enforceRateLimit("availability", 90, 60);
    if (!allowed) return jsonError("Troppe richieste. Riprova tra poco.", 429);

    const url = new URL(request.url);
    const date = url.searchParams.get("date") || "";
    const serviceName = url.searchParams.get("service") || "";

    const dateError = validateDate(date);
    if (dateError) return jsonError(dateError, 400);

    const today = nowRome().date;
    if (date < today) return jsonError("La data è già passata.", 400);

    const maxDate = (() => {
      const value = new Date(`${today}T00:00:00Z`);
      value.setUTCDate(value.getUTCDate() + MAX_ADVANCE_DAYS);
      return value.toISOString().slice(0, 10);
    })();
    if (date > maxDate) return jsonError("Puoi cercare disponibilità fino a un anno in avanti.", 400);

    const closed = BUSINESS.closedWeekdays.includes(dayIndex(date) as 0 | 1);
    if (closed) {
      return NextResponse.json({
        date,
        closed: true,
        unavailableTimes: [],
        appointments: [],
      });
    }

    const service = serviceName ? getService(serviceName) : null;
    if (serviceName && !service) return jsonError("Il servizio indicato non è valido.", 400);

    const rows = await fetchBusyRows(date);
    const unavailableTimes = unavailableSlotsForDate(date, rows, service?.duration);

    return NextResponse.json({
      date,
      closed: false,
      openingHours: BUSINESS.openingHoursLabel,
      unavailableTimes,
      appointments: unavailableTimes.map((time) => ({ time })),
    });
  } catch (error) {
    console.error("GET /api/appointments", error);
    return jsonError("Non riesco a verificare la disponibilità in questo momento.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const allowed = await enforceRateLimit("appointment-create", 5, 600);
    if (!allowed) return jsonError("Hai inviato troppe richieste. Riprova più tardi.", 429);

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return jsonError("Richiesta non valida.", 400);

    const customerName = normalizeText(String((body as Record<string, unknown>).customer_name ?? ""));
    const serviceName = normalizeText(String((body as Record<string, unknown>).service ?? ""));
    const date = String((body as Record<string, unknown>).date ?? "");
    const time = String((body as Record<string, unknown>).time ?? "");
    const addOns = normalizeAddOns((body as Record<string, unknown>).add_ons);
    const consent = (body as Record<string, unknown>).privacy_consent;

    if (!customerName || customerName.length < 2 || customerName.length > 80) {
      return jsonError("Inserisci un nome valido.", 400);
    }

    if (!/^[\p{L}\p{M}0-9' .-]+$/u.test(customerName)) {
      return jsonError("Il nome contiene caratteri non validi.", 400);
    }

    if (!serviceName || !getService(serviceName)) return jsonError("Il servizio indicato non è valido.", 400);
    if (addOns === null) return jsonError("Gli extra selezionati non sono validi.", 400);
    if (consent !== true) return jsonError("È necessario accettare l'informativa privacy.", 400);

    const dateError = validateDate(date);
    if (dateError) return jsonError(dateError, 400);

    if (!isBookableSlot(time)) {
      return jsonError("L'orario deve essere compreso tra le 09:00 e le 19:30 e a intervalli di 30 minuti.", 400);
    }

    if (BUSINESS.closedWeekdays.includes(dayIndex(date) as 0 | 1)) {
      return jsonError(`Hair Studio Milano è chiuso il ${italianDate(date)}.`, 400);
    }

    const now = nowRome();
    if (date < now.date) return jsonError("La data indicata è già passata.", 400);
    if (date === now.date && (timeToMinutes(time) ?? -1) <= now.minutes) {
      return jsonError("Questo orario è già passato. Scegline uno successivo.", 400);
    }

    const service = getService(serviceName)!;
    const selectedAddOns = addOns!;
    const addOnRecords = selectedAddOns.map((name) => ADD_ONS.find((item) => item.name === name)!);
    const duration = service.duration + addOnRecords.reduce((sum, item) => sum + item.duration, 0);
    const estimatedTotal = service.price + addOnRecords.reduce((sum, item) => sum + item.price, 0);
    const startMinutes = timeToMinutes(time)!;

    if (startMinutes + duration > BUSINESS.closeMinutes) {
      return jsonError("Questo orario è troppo tardi per la durata del servizio scelto. Scegli un orario precedente.", 409);
    }

    const supabase = getSupabaseAdmin();
    const startAt = buildStartAt(date, time);

    const { data, error } = await supabase
      .from("booking_requests")
      .insert({
        customer_name: customerName,
        service: service.name,
        start_at: startAt,
        duration_minutes: duration,
        add_ons: selectedAddOns,
        estimated_total: estimatedTotal,
        price_is_from: service.priceFrom,
        privacy_consent: true,
        privacy_consent_at: new Date().toISOString(),
        privacy_policy_version: process.env.NEXT_PUBLIC_PRIVACY_POLICY_VERSION || "1.0",
        status: "requested",
        source: "website",
      })
      .select("id,start_at,service,add_ons,estimated_total,price_is_from,duration_minutes,status")
      .single();

    if (error) {
      if (error.code === "23P01" || error.code === "23505") {
        return jsonError("Questo orario non è più disponibile. Aggiorna la disponibilità e scegline un altro.", 409);
      }
      console.error("POST /api/appointments", error);
      return jsonError("Non è stato possibile creare la richiesta di appuntamento.", 500);
    }

    return NextResponse.json({
      ok: true,
      message: "Richiesta di appuntamento inviata.",
      appointment: data,
    });
  } catch (error) {
    console.error("POST /api/appointments", error);
    return jsonError("Errore interno del server.", 500);
  }
}

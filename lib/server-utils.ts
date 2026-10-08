import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function validDate(date: string) {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const parsed = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return (
    parsed.getUTCFullYear() === Number(match[1]) &&
    parsed.getUTCMonth() === Number(match[2]) - 1 &&
    parsed.getUTCDate() === Number(match[3])
  );
}

export function addDays(date: string, amount: number) {
  const [year, month, day] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  parsed.setUTCDate(parsed.getUTCDate() + amount);
  return `${parsed.getUTCFullYear()}-${pad(parsed.getUTCMonth() + 1)}-${pad(parsed.getUTCDate())}`;
}

export function dayIndex(date: string) {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

export function dayName(date: string) {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

export function italianDate(date: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

export function nowRome() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const date = `${get("year")}-${get("month")}-${get("day")}`;
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  return { date, minutes };
}

export function timeToMinutes(time: string) {
  const match = time.match(/^(\d{2}):(\d{2})$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function isBookableSlot(time: string) {
  const minutes = timeToMinutes(time);
  if (minutes === null) return false;
  return (
    minutes >= 9 * 60 &&
    minutes <= 19 * 60 + 30 &&
    minutes % 30 === 0
  );
}

export function buildStartAt(date: string, time: string) {
  return `${date}T${time}:00`;
}

export function rangeEndMinutes(startMinutes: number, durationMinutes: number) {
  return startMinutes + durationMinutes;
}

export function getClientIp(requestHeaders: Headers) {
  const forwarded = requestHeaders.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return requestHeaders.get("x-real-ip")?.trim() || "unknown";
}

const localRateLimitStore = new Map<
  string,
  { count: number; resetAt: number }
>();

export async function enforceRateLimit(
  endpoint: string,
  limit: number,
  windowSeconds: number,
) {
  const incoming = await headers();
  const ip = getClientIp(incoming);
  const key = `${endpoint}:${ip}`;
  const now = Date.now();
  const existing = localRateLimitStore.get(key);

  if (!existing || now >= existing.resetAt) {
    localRateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    });
    return true;
  }

  if (existing.count >= limit) return false;

  existing.count += 1;
  return true;
}

import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getService } from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, service, date, time } = body;

    if (!name || !service || !date || !time) {
      return NextResponse.json({ error: "Dati incompleti per la prenotazione" }, { status: 400 });
    }

    const serviceObj = getService(service);
    const duration = serviceObj ? serviceObj.duration : 30;
    
    // Calcola il prezzo stimato approssimativo o usa di default
    const estimatedTotal = serviceObj ? serviceObj.price : 25;
    const priceIsFrom = serviceObj ? serviceObj.priceIsFrom : false;

    // Crea la stringa ISO completa per start_at (es. 2026-10-12T14:00:00)
    const startAt = `${date}T${time}:00`;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("booking_requests")
      .insert([
        {
          customer_name: name,
          service: service,
          date: date,
          start_at: startAt,
          duration_minutes: duration,
          estimated_total: estimatedTotal,
          price_is_from: priceIsFrom,
          status: "confirmed", // o "requested"
          add_ons: [],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    return NextResponse.json({ success: true, booking: data });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "Errore durante il salvataggio della prenotazione" }, { status: 500 });
  }
}
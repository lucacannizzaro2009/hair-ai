import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month"); // 1-12

    if (!year || !month) {
      return NextResponse.json({ error: "Anno e mese richiesti" }, { status: 400 });
    }

    // Calcola il primo e l'ultimo giorno del mese
    const startDate = new Date(`${year}-${month.padStart(2, "0")}-01T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("booking_requests")
      .select("id, customer_name, service, start_at, duration_minutes, add_ons, estimated_total, price_is_from, status")
      .gte("start_at", startDate.toISOString())
      .lt("start_at", endDate.toISOString())
      .order("start_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ appointments: data ?? [] });
  } catch (error) {
    console.error("GET /api/admin/appointments error:", error);
    return NextResponse.json({ error: "Errore recupero agenda" }, { status: 500 });
  }
}
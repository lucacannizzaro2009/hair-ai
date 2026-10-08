import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const required = [
    "GROQ_API_KEY",
    "SUPABASE_SECRET_KEY",
    "RATE_LIMIT_SECRET",
  ];

  const legacySupported = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const missing = required.filter((key) => !process.env[key]);
  const supabaseReady = Boolean(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);
  const actualMissing = missing.filter((key) => !(key === "SUPABASE_SECRET_KEY" && legacySupported));

  if (actualMissing.length) {
    return NextResponse.json(
      { ok: false, missing: actualMissing },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, supabaseReady });
}

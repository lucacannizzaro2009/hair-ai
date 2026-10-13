"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: string;
  customer_name: string;
  service: string;
  start_at: string;
  duration_minutes: number;
  add_ons: string[];
  estimated_total: number;
  price_is_from: boolean;
  status: string;
};

export default function AdminDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => new Date().toISOString().slice(0, 10));
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // Carica gli appuntamenti del mese corrente
  async function loadMonthAppointments(year: number, month: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/appointments?year=${year}&month=${month}`);
      const data = await res.json();
      if (res.ok) {
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMonthAppointments(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  // Genera i giorni per il calendario
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Filtra gli appuntamenti del giorno selezionato
  const selectedAppointments = appointments.filter((app) => app.start_at.startsWith(selectedDateStr));

  // Controlla se un giorno specifico ha appuntamenti
  const hasAppointments = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return appointments.some((app) => app.start_at.startsWith(dateStr));
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  function formatTime(isoString: string) {
    try {
      return new Date(isoString).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Rome" });
    } catch {
      return "--:--";
    }
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", backgroundColor: "#0a0a0a", color: "#ededed", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      
      {/* SIDEBAR CALENDARIO */}
      <div style={{ flex: "1 1 350px", maxWidth: "450px", padding: "40px", backgroundColor: "#111", borderRight: "1px solid #222" }}>
        <h1 style={{ fontSize: "22px", letterSpacing: "2px", fontWeight: "300", marginBottom: "40px", color: "#fff" }}>
          HAIR STUDIO <br/> <b style={{ fontWeight: "700" }}>MILANO</b>
        </h1>

        <div style={{ backgroundColor: "#1a1a1a", padding: "20px", borderRadius: "16px", border: "1px solid #2a2a2a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <button onClick={handlePrevMonth} style={{ background: "transparent", color: "#888", border: "none", cursor: "pointer", fontSize: "18px" }}>◀</button>
            <h2 style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              {currentDate.toLocaleString("it-IT", { month: "long", year: "numeric" })}
            </h2>
            <button onClick={handleNextMonth} style={{ background: "transparent", color: "#888", border: "none", cursor: "pointer", fontSize: "18px" }}>▶</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", textAlign: "center", marginBottom: "10px", fontSize: "12px", color: "#666" }}>
            {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((d) => <div key={d}>{d}</div>)}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
            {blanks.map((_, i) => <div key={`blank-${i}`} />)}
            {days.map((day) => {
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isSelected = selectedDateStr === dateStr;
              const hasApp = hasAppointments(day);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDateStr(dateStr)}
                  style={{
                    position: "relative",
                    aspectRatio: "1",
                    background: isSelected ? "#fff" : "transparent",
                    color: isSelected ? "#000" : "#ccc",
                    border: isSelected ? "none" : "1px solid transparent",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: isSelected ? "bold" : "normal",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.border = "1px solid #444" }}
                  onMouseOut={(e) => { if (!isSelected) e.currentTarget.style.border = "1px solid transparent" }}
                >
                  {day}
                  {hasApp && (
                    <span style={{ position: "absolute", bottom: "4px", width: "4px", height: "4px", backgroundColor: isSelected ? "#000" : "#3b82f6", borderRadius: "50%" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AGENDA GIORNALIERA */}
      <div style={{ flex: "2 1 500px", padding: "40px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "30px", borderBottom: "1px solid #222", paddingBottom: "15px" }}>
          Agenda del {new Date(selectedDateStr).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
        </h2>

        {loading ? (
          <p style={{ color: "#666" }}>Caricamento dati...</p>
        ) : selectedAppointments.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", backgroundColor: "#111", borderRadius: "16px", border: "1px dashed #333", color: "#666" }}>
            <span style={{ fontSize: "40px", marginBottom: "15px" }}>☕</span>
            <p style={{ fontSize: "16px", margin: 0 }}>Nessun appuntamento per questa giornata.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {selectedAppointments.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#111", padding: "24px", borderRadius: "16px", borderLeft: "4px solid #3b82f6", transition: "transform 0.2s" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "bold", color: "#fff" }}>{formatTime(item.start_at)}</span>
                    <span style={{ fontSize: "18px", color: "#ddd" }}>{item.customer_name}</span>
                  </div>
                  <div style={{ color: "#aaa", fontSize: "15px" }}>
                    Servizio: <b style={{ color: "#fff", fontWeight: "500" }}>{item.service}</b> ({item.duration_minutes} min)
                  </div>
                  {item.add_ons && item.add_ons.length > 0 && (
                    <div style={{ color: "#888", fontSize: "14px", marginTop: "6px" }}>
                      Extra: {item.add_ons.join(", ")}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <div style={{ fontSize: "22px", fontWeight: "600", color: "#fff" }}>
                    {item.price_is_from ? "da " : ""}€{item.estimated_total}
                  </div>
                  <span style={{ marginTop: "10px", padding: "6px 12px", fontSize: "12px", borderRadius: "8px", textTransform: "uppercase", letterSpacing: "1px", backgroundColor: item.status === "confirmed" ? "rgba(74, 222, 128, 0.1)" : "rgba(251, 191, 36, 0.1)", color: item.status === "confirmed" ? "#4ade80" : "#fbbf24" }}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
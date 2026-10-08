import { ImageResponse } from "next/og";

export const runtime = "edge";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#ede6dc",
          color: "#1b1917",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Hair Studio Milano
        </div>
        <div>
          <div style={{ fontSize: 72, lineHeight: 0.98, fontWeight: 700, maxWidth: 950 }}>
            Hair, color &amp; style.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, opacity: 0.7 }}>
            Via Torino 15 · Milano
          </div>
        </div>
        <div style={{ fontSize: 22, opacity: 0.55 }}>
          Tagli · Styling · Colore · Trattamenti · Concierge AI
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

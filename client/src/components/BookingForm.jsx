import React, { useMemo, useState } from "react";

function toLocalISO(dateStr, hhmm) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  const dt = new Date(y, m - 1, d, hh, mm, 0);
  return dt.toISOString(); 
}

export default function BookingForm({ onSubmit, date }) {
  const [title, setTitle] = useState("Reserva");
  const [customerName, setCustomerName] = useState("");
  const [startHHMM, setStartHHMM] = useState("09:00");
  const [endHHMM, setEndHHMM] = useState("10:00");
  const [sending, setSending] = useState(false);

  const startTime = useMemo(() => toLocalISO(date, startHHMM), [date, startHHMM]);
  const endTime = useMemo(() => toLocalISO(date, endHHMM), [date, endHHMM]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    try {
      await onSubmit({ title, customerName, startTime, endTime });
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
      <div style={{ display:"flex", flexWrap:'wrap' }}>
        <label>Título</label>
        <br />
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: 8, width: "100%" }} />
      </div>

      <div style={{ display:"flex", flexWrap:'wrap' }}>
        <label>Cliente (opcional)</label>
        <br />
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={{ padding: 8, width: "100%" }}
        />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ display:"flex", flexWrap:"wrap" }}>
          <label>Inicio</label>
          <br />
          <input type="time" value={startHHMM} onChange={(e) => setStartHHMM(e.target.value)} style={{ padding: 8, width: "100%" }} />
        </div>

        <div style={{ display:"flex", flexWrap:"wrap" }}>
          <label>Fin</label>
          <br />
          <input type="time" value={endHHMM} onChange={(e) => setEndHHMM(e.target.value)} style={{ padding: 8, width: "100%" }} />
        </div>
      </div>

      <button type="submit" disabled={sending} style={{ padding: "9px 14px", cursor: "pointer" }}>
        {sending ? "Creando..." : "Crear"}
      </button>
    </form>
  );
}

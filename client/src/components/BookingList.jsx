import React from "react";

function fmt(dt) {
  const d = new Date(dt);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function BookingList({ items }) {
  if (!items?.length) return <p style={{ opacity: 0.7 }}>No hay reservas.</p>;

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map((b) => (
        <div key={b.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <b>{b.title}</b>
            <span style={{ opacity: 0.8 }}>
              {fmt(b.start_time)} - {fmt(b.end_time)}
            </span>
          </div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            Recurso: {b.resource_name} • Cliente: {b.customer_name || "—"}
          </div>
        </div>
      ))}
    </div>
  );
}

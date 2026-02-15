import React, { useEffect, useMemo, useState } from "react";
import { createBooking, getBookings, getResources } from "./api.js";
import BookingForm from "./components/BookingForm.jsx";
import BookingList from "./components/BookingList.jsx";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function App() {
  const [resources, setResources] = useState([]);
  const [resourceId, setResourceId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedResourceId = useMemo(() => (resourceId ? Number(resourceId) : null), [resourceId]);
  const [error, setError] = useState("");

  useEffect(() => {
    getResources()
      .then((data) => {
        setResources(data);
        if (data?.[0]?.id) setResourceId(String(data[0].id));
      })
      .catch((e) => setError(e.message));
  }, []);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await getBookings({ date, resourceId: selectedResourceId });
      setItems(data.items || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedResourceId) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, selectedResourceId]);

  async function onCreate(form) {
    setError("");
    try {
      await createBooking({
        resourceId: selectedResourceId,
        title: form.title,
        customerName: form.customerName || null,
        startTime: form.startTime,
        endTime: form.endTime,
      });
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div style={{ fontFamily: "system-ui, Arial", maxWidth: 900, margin: "30px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 6 }}>Mini Booking</h1>
      {error ? (
        <div style={{ background: "#ffe8e8", padding: 12, borderRadius: 8, marginBottom: 12 }}>
          <b>Error:</b> {error}
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap", marginBottom: 16 }}>
        <div>
          <label>Recurso</label>
          <br />
          <select
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            style={{ padding: 8, minWidth: 220 }}
          >
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} (#{r.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Fecha</label>
          <br />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: 8 }} />
        </div>

        <button onClick={refresh} style={{ padding: "9px 14px", cursor: "pointer" }}>
          {loading ? "Cargando..." : "Refrescar"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 14}}>
          <h2 style={{ marginTop: 0 }}>Crear reserva</h2>
          <BookingForm onSubmit={onCreate} date={date} />
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 14 }}>
          <h2 style={{ marginTop: 0 }}>Reservas del día</h2>
          <BookingList items={items} />
        </div>
      </div>
    </div>
  );
}

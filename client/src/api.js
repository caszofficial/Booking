const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getResources() {
  const r = await fetch(`${API_URL}/api/resources`);
  if (!r.ok) throw new Error("No se pudieron cargar los recursos");
  return r.json();
}

export async function getBookings({ date, resourceId }) {
  const params = new URLSearchParams();
  if (date) params.set("date", date);
  if (resourceId) params.set("resourceId", String(resourceId));

  const r = await fetch(`${API_URL}/api/bookings?${params.toString()}`);
  if (!r.ok) throw new Error("No se pudieron cargar las reservas");
  return r.json();
}

export async function createBooking(payload) {
  const r = await fetch(`${API_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = data?.error || "No se pudo crear la reserva";
    const err = new Error(msg);
    err.status = r.status;
    err.details = data;
    throw err;
  }
  return data;
}

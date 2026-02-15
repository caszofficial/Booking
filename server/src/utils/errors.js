export function toHttpError(err) {

  if (err?.code === "23P01") {
    return { status: 409, message: "Esta reserva se solapa con otra existente para ese recurso." };
  }
  if (err?.code === "23514") {
    return { status: 400, message: "Rango de fechas inválido (end_time debe ser mayor a start_time)." };
  }
  return { status: 500, message: "Error interno del servidor." };
}

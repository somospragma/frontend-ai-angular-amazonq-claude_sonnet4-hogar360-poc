export interface Schedule {
  id: string;
  vendedorId: string;
  casaId: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  fechaCreacion: string;
}

export interface CreateScheduleRequest {
  casaId: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
}
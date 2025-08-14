export interface Appointment {
  id: string;
  horarioDisponibleId: string;
  compradorEmail: string;
  fechaAgendamiento: string;
}

export interface CreateAppointmentRequest {
  horarioDisponibleId: string;
  compradorEmail: string;
}
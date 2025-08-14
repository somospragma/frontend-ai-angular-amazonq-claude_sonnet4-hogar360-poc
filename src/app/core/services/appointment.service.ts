import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Appointment, CreateAppointmentRequest, UserRole } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly STORAGE_KEY = 'hogar360_appointments';
  private appointments: Appointment[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.appointments = JSON.parse(stored);
    } else {
      this.appointments = [];
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.appointments));
  }

  createAppointment(appointmentData: CreateAppointmentRequest, userRole?: string): Observable<Appointment> {
    // Validar que solo los compradores puedan agendar citas
    if (userRole && userRole !== UserRole.COMPRADOR) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Solo los compradores pueden agendar visitas'));
        }, 1000);
      });
    }

    // Validar que no haya más de 2 compradores para el mismo horario
    const existingAppointments = this.appointments.filter(
      a => a.horarioDisponibleId === appointmentData.horarioDisponibleId
    );

    if (existingAppointments.length >= 2) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Este horario ya tiene el máximo de 2 compradores agendados'));
        }, 1000);
      });
    }

    // Validar que el mismo comprador no agende el mismo horario dos veces
    const duplicateAppointment = existingAppointments.find(
      a => a.compradorEmail.toLowerCase() === appointmentData.compradorEmail.toLowerCase()
    );

    if (duplicateAppointment) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Ya tienes una cita agendada para este horario'));
        }, 1000);
      });
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      horarioDisponibleId: appointmentData.horarioDisponibleId,
      compradorEmail: appointmentData.compradorEmail,
      fechaAgendamiento: new Date().toISOString()
    };

    this.appointments.push(newAppointment);
    this.saveToStorage();

    return of(newAppointment).pipe(delay(1000));
  }

  getAppointmentsByEmail(email: string): Observable<Appointment[]> {
    const userAppointments = this.appointments.filter(
      a => a.compradorEmail.toLowerCase() === email.toLowerCase()
    );
    return of(userAppointments).pipe(delay(500));
  }

  getAppointmentCountBySchedule(scheduleId: string): number {
    return this.appointments.filter(a => a.horarioDisponibleId === scheduleId).length;
  }

  cancelAppointment(id: string, email: string): Observable<void> {
    const appointment = this.appointments.find(a => a.id === id);
    
    if (!appointment) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Cita no encontrada'));
        }, 500);
      });
    }

    if (appointment.compradorEmail.toLowerCase() !== email.toLowerCase()) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Solo puedes cancelar tus propias citas'));
        }, 500);
      });
    }

    const index = this.appointments.findIndex(a => a.id === id);
    this.appointments.splice(index, 1);
    this.saveToStorage();

    return of(void 0).pipe(delay(500));
  }
}
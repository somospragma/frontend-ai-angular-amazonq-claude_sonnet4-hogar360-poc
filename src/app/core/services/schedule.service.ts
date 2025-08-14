import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Schedule, CreateScheduleRequest } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private readonly STORAGE_KEY = 'hogar360_schedules';
  private schedules: Schedule[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.schedules = JSON.parse(stored);
    } else {
      this.schedules = [];
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.schedules));
  }

  createSchedule(scheduleData: CreateScheduleRequest, vendedorId: string, isVendedor: boolean = false): Observable<Schedule> {
    // Validar rol de vendedor
    if (!isVendedor) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Solo los vendedores pueden crear horarios de visitas'));
        }, 1000);
      });
    }

    const fechaInicio = new Date(scheduleData.fechaHoraInicio);
    const fechaFin = new Date(scheduleData.fechaHoraFin);
    const ahora = new Date();
    const tresSemanasDespues = new Date();
    tresSemanasDespues.setDate(tresSemanasDespues.getDate() + 21);

    // Validar que la fecha esté dentro de las próximas 3 semanas
    if (fechaInicio > tresSemanasDespues) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Solo se pueden registrar horarios dentro de los próximos 21 días'));
        }, 1000);
      });
    }

    // Validar que la fecha no sea en el pasado
    if (fechaInicio <= ahora) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('No se pueden crear horarios en el pasado'));
        }, 1000);
      });
    }

    // Validar que la hora de fin sea después de la hora de inicio
    if (fechaFin <= fechaInicio) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('La hora de fin debe ser posterior a la hora de inicio'));
        }, 1000);
      });
    }

    // Validar que no haya conflicto de horarios para el mismo vendedor
    const conflicto = this.schedules.some(schedule => 
      schedule.vendedorId === vendedorId &&
      ((fechaInicio >= new Date(schedule.fechaHoraInicio) && fechaInicio < new Date(schedule.fechaHoraFin)) ||
       (fechaFin > new Date(schedule.fechaHoraInicio) && fechaFin <= new Date(schedule.fechaHoraFin)) ||
       (fechaInicio <= new Date(schedule.fechaHoraInicio) && fechaFin >= new Date(schedule.fechaHoraFin)))
    );

    if (conflicto) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Ya tienes un horario programado en ese rango de tiempo'));
        }, 1000);
      });
    }

    const newSchedule: Schedule = {
      id: Date.now().toString(),
      vendedorId: vendedorId,
      casaId: scheduleData.casaId,
      fechaHoraInicio: scheduleData.fechaHoraInicio,
      fechaHoraFin: scheduleData.fechaHoraFin,
      fechaCreacion: new Date().toISOString()
    };

    this.schedules.push(newSchedule);
    this.saveToStorage();

    return of(newSchedule).pipe(delay(1000));
  }

  getSchedulesByVendedor(vendedorId: string, options?: any): Observable<{schedules: Schedule[], total: number, page: number, totalPages: number}> {
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 10;
    
    let filteredSchedules = this.schedules.filter(s => s.vendedorId === vendedorId);
    
    // Ordenar por fecha de inicio
    filteredSchedules.sort((a, b) => new Date(a.fechaHoraInicio).getTime() - new Date(b.fechaHoraInicio).getTime());
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedSchedules = filteredSchedules.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredSchedules.length / pageSize);

    return of({
      schedules: paginatedSchedules,
      total: filteredSchedules.length,
      page,
      totalPages
    }).pipe(delay(500));
  }

  deleteSchedule(id: string, vendedorId: string): Observable<void> {
    const schedule = this.schedules.find(s => s.id === id);
    
    if (!schedule) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Horario no encontrado'));
        }, 500);
      });
    }

    if (schedule.vendedorId !== vendedorId) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Solo puedes eliminar tus propios horarios'));
        }, 500);
      });
    }

    const index = this.schedules.findIndex(s => s.id === id);
    this.schedules.splice(index, 1);
    this.saveToStorage();

    return of(void 0).pipe(delay(500));
  }
}
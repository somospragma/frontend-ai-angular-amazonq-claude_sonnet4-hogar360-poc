import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/services/appointment.service';
import { ScheduleService } from '../../../core/services/schedule.service';
import { PropertyService } from '../../../core/services/property.service';
import { LocationService } from '../../../core/services/location.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Appointment, Schedule, Property, Location, User } from '../../../shared/models';

@Component({
  selector: 'app-admin-my-appointments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1 class="text-2xl font-normal text-gray-900 mb-6">Mis Citas Agendadas</h1>
      
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propiedad</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let appointment of appointmentsWithSchedules">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ getPropertyName(appointment.schedule?.casaId) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ getVendedorName(appointment.schedule?.vendedorId) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ getPropertyLocation(appointment.schedule?.casaId) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(appointment.schedule?.fechaHoraInicio) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ formatTime(appointment.schedule?.fechaHoraInicio) }} - {{ formatTime(appointment.schedule?.fechaHoraFin) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                        [class]="getStatusClass(appointment.schedule)">
                    {{ getStatusLabel(appointment.schedule) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button *ngIf="canCancel(appointment.schedule)" 
                          (click)="cancelAppointment(appointment)"
                          [disabled]="isLoading"
                          class="text-red-600 hover:text-red-900 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ isLoading ? 'Cancelando...' : 'Cancelar' }}
                  </button>
                  <span *ngIf="!canCancel(appointment.schedule)" class="text-gray-400 text-xs">No disponible</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="bg-white px-4 py-3 text-center text-sm text-gray-500" *ngIf="appointmentsWithSchedules.length === 0 && !isLoading">
          No tienes citas agendadas.
        </div>

        <div class="bg-white px-4 py-3 text-center text-sm text-gray-500" *ngIf="isLoading">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span class="ml-2">Cargando citas...</span>
        </div>
        
        <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-md p-4 m-4">
          <p class="text-sm text-green-600">{{ successMessage }}</p>
        </div>
        
        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4 m-4">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  `
})
export class AdminMyAppointmentsComponent {
  private appointmentService = inject(AppointmentService);
  private scheduleService = inject(ScheduleService);
  private propertyService = inject(PropertyService);
  private locationService = inject(LocationService);
  private userService = inject(UserService);
  public authService = inject(AuthService);

  appointments: Appointment[] = [];
  schedules: Schedule[] = [];
  properties: Property[] = [];
  locations: Location[] = [];
  users: User[] = [];
  appointmentsWithSchedules: any[] = [];
  
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.loadProperties();
    this.loadLocations();
    this.loadUsers();
    this.loadSchedules();
    this.loadAppointments();
  }

  private loadAppointments(): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    this.isLoading = true;
    this.appointmentService.getAppointmentsByEmail(currentUser.correo).subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.combineAppointmentsWithSchedules();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.isLoading = false;
      }
    });
  }

  private loadSchedules(): void {
    const stored = localStorage.getItem('hogar360_schedules');
    if (stored) {
      this.schedules = JSON.parse(stored);
    }
  }

  private loadProperties(): void {
    this.propertyService.getProperties().subscribe({
      next: (response) => {
        this.properties = response.properties || [];
      },
      error: (error) => {
        console.error('Error loading properties:', error);
      }
    });
  }

  private loadLocations(): void {
    this.locationService.getLocations().subscribe({
      next: (response) => {
        this.locations = response.locations || [];
      },
      error: (error) => {
        console.error('Error loading locations:', error);
      }
    });
  }

  private loadUsers(): void {
    const stored = localStorage.getItem('hogar360_users');
    if (stored) {
      this.users = JSON.parse(stored);
    }
  }

  private combineAppointmentsWithSchedules(): void {
    this.appointmentsWithSchedules = this.appointments.map(appointment => ({
      ...appointment,
      schedule: this.schedules.find(s => s.id === appointment.horarioDisponibleId)
    })).filter(item => item.schedule); // Solo mostrar citas con horarios válidos
  }

  getPropertyName(casaId?: string): string {
    if (!casaId) return 'N/A';
    const property = this.properties.find(p => p.id === casaId);
    return property?.nombre || 'Propiedad no encontrada';
  }

  getPropertyLocation(casaId?: string): string {
    if (!casaId) return 'N/A';
    const property = this.properties.find(p => p.id === casaId);
    if (!property) return 'Ubicación no disponible';
    
    const location = this.locations.find(l => l.id === property.ubicacionId);
    return location ? `${location.ciudad}, ${location.departamento}` : 'Ubicación no disponible';
  }

  getVendedorName(vendedorId?: string): string {
    if (!vendedorId) return 'N/A';
    const user = this.users.find(u => u.id === vendedorId);
    return user ? `${user.nombre} ${user.apellido}` : 'Vendedor no encontrado';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  }

  formatTime(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }

  getStatusLabel(schedule?: Schedule): string {
    if (!schedule) return 'N/A';
    const now = new Date();
    const startTime = new Date(schedule.fechaHoraInicio);
    const endTime = new Date(schedule.fechaHoraFin);

    if (endTime < now) return 'Finalizada';
    if (startTime <= now && endTime > now) return 'En curso';
    return 'Programada';
  }

  getStatusClass(schedule?: Schedule): string {
    if (!schedule) return 'bg-gray-100 text-gray-800';
    const now = new Date();
    const startTime = new Date(schedule.fechaHoraInicio);
    const endTime = new Date(schedule.fechaHoraFin);

    if (endTime < now) return 'bg-gray-100 text-gray-800';
    if (startTime <= now && endTime > now) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  }

  canCancel(schedule?: Schedule): boolean {
    if (!schedule) return false;
    const now = new Date();
    const startTime = new Date(schedule.fechaHoraInicio);
    return startTime > now; // Solo se puede cancelar si no ha comenzado
  }

  cancelAppointment(appointment: any): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      const currentUser = this.authService.currentUser();
      if (!currentUser) return;

      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.appointmentService.cancelAppointment(appointment.id, currentUser.correo).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Cita cancelada exitosamente';
          this.loadAppointments();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al cancelar la cita';
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }
}
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../../core/services/schedule.service';
import { PropertyService } from '../../../core/services/property.service';
import { LocationService } from '../../../core/services/location.service';
import { UserService } from '../../../core/services/user.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Schedule, Property, Location, User, UserRole } from '../../../shared/models';

@Component({
  selector: 'app-admin-public-schedule-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h1 class="text-2xl font-normal text-gray-900 mb-6">Horarios Disponibles para Visitas</h1>
      
      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora Inicio</label>
            <input type="datetime-local" [(ngModel)]="filters.fechaInicio" (change)="applyFilters()" 
                   class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora Fin</label>
            <input type="datetime-local" [(ngModel)]="filters.fechaFin" (change)="applyFilters()" 
                   class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <select [(ngModel)]="filters.ubicacionId" (change)="applyFilters()" 
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas las ubicaciones</option>
              <option *ngFor="let location of locations" [value]="location.id">{{ location.ciudad }}, {{ location.departamento }}</option>
            </select>
          </div>
        </div>
        
        <button (click)="clearFilters()" 
                class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
          Limpiar filtros
        </button>
      </div>

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
              <tr *ngFor="let schedule of schedules">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ getPropertyName(schedule.casaId) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ getVendedorName(schedule.vendedorId) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ getPropertyLocation(schedule.casaId) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(schedule.fechaHoraInicio) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ formatTime(schedule.fechaHoraInicio) }} - {{ formatTime(schedule.fechaHoraFin) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Disponible
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button *ngIf="authService.currentUser()?.rol === UserRole.COMPRADOR" 
                          (click)="agendarVisita(schedule)" 
                          [disabled]="isLoading"
                          class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ isLoading ? 'Agendando...' : 'Agendar Visita' }}
                  </button>
                  <span *ngIf="authService.currentUser()?.rol !== UserRole.COMPRADOR" class="text-gray-400 text-xs">
                    Solo compradores
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="bg-white px-4 py-3 text-center text-sm text-gray-500" *ngIf="schedules.length === 0 && !isLoading">
          {{ hasFilters() ? 'No se encontraron horarios disponibles con los filtros seleccionados.' : 'No hay horarios disponibles en este momento.' }}
        </div>

        <div class="bg-white px-4 py-3 text-center text-sm text-gray-500" *ngIf="isLoading">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span class="ml-2">Cargando horarios...</span>
        </div>
        
        <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-md p-4 m-4">
          <p class="text-sm text-green-600">{{ successMessage }}</p>
        </div>
        
        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4 m-4">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>
        
        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200" *ngIf="totalPages > 1">
          <div class="text-sm text-gray-700">
            Mostrando {{ (currentPage - 1) * 10 + 1 }} - {{ Math.min(currentPage * 10, total) }} de {{ total }} horarios
          </div>
          <nav class="flex space-x-1">
            <button (click)="goToPage(currentPage - 1)" 
                    [disabled]="currentPage === 1"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              ← Anterior
            </button>
            
            <button *ngFor="let page of getPageNumbers()" 
                    (click)="goToPage(page)"
                    [class]="page === currentPage ? 'px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-gray-300 rounded' : 'px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50'">
              {{ page }}
            </button>
            
            <button (click)="goToPage(currentPage + 1)" 
                    [disabled]="currentPage === totalPages"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Siguiente →
            </button>
          </nav>
        </div>
      </div>
    </div>
  `
})
export class AdminPublicScheduleListComponent {
  private scheduleService = inject(ScheduleService);
  private propertyService = inject(PropertyService);
  private locationService = inject(LocationService);
  private userService = inject(UserService);
  private appointmentService = inject(AppointmentService);
  public authService = inject(AuthService);

  schedules: Schedule[] = [];
  properties: Property[] = [];
  locations: Location[] = [];
  users: User[] = [];
  
  filters = {
    fechaInicio: '',
    fechaFin: '',
    ubicacionId: ''
  };
  
  currentPage = 1;
  totalPages = 1;
  total = 0;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  
  UserRole = UserRole;

  constructor() {
    this.loadProperties();
    this.loadLocations();
    this.loadUsers();
    this.loadSchedules();
  }

  private loadSchedules(): void {
    this.isLoading = true;
    const options = {
      page: this.currentPage,
      pageSize: 10,
      ...this.getFilterValues()
    };

    this.scheduleService.getPublicSchedules(options).subscribe({
      next: (response) => {
        this.schedules = response.schedules || [];
        this.totalPages = response.totalPages;
        this.total = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading schedules:', error);
        this.isLoading = false;
      }
    });
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

  private getFilterValues(): any {
    const filters: any = {};
    
    if (this.filters.fechaInicio) filters.fechaInicio = this.filters.fechaInicio;
    if (this.filters.fechaFin) filters.fechaFin = this.filters.fechaFin;
    if (this.filters.ubicacionId) filters.ubicacionId = this.filters.ubicacionId;
    
    return filters;
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadSchedules();
  }

  clearFilters(): void {
    this.filters = {
      fechaInicio: '',
      fechaFin: '',
      ubicacionId: ''
    };
    this.applyFilters();
  }

  hasFilters(): boolean {
    return !!(this.filters.fechaInicio || this.filters.fechaFin || this.filters.ubicacionId);
  }

  getPropertyName(casaId: string): string {
    const property = this.properties.find(p => p.id === casaId);
    return property?.nombre || 'Propiedad no encontrada';
  }

  getPropertyLocation(casaId: string): string {
    const property = this.properties.find(p => p.id === casaId);
    if (!property) return 'Ubicación no disponible';
    
    const location = this.locations.find(l => l.id === property.ubicacionId);
    return location ? `${location.ciudad}, ${location.departamento}` : 'Ubicación no disponible';
  }

  getVendedorName(vendedorId: string): string {
    const user = this.users.find(u => u.id === vendedorId);
    return user ? `${user.nombre} ${user.apellido}` : 'Vendedor no encontrado';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadSchedules();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  agendarVisita(schedule: Schedule): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.errorMessage = 'Debes iniciar sesión para agendar una visita';
      return;
    }

    if (currentUser.rol !== UserRole.COMPRADOR) {
      this.errorMessage = 'Solo los compradores pueden agendar visitas';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const appointmentData = {
      horarioDisponibleId: schedule.id,
      compradorEmail: currentUser.correo
    };

    this.appointmentService.createAppointment(appointmentData, currentUser.rol).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Visita agendada exitosamente';
        // Recargar horarios para actualizar disponibilidad
        this.loadSchedules();
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Error al agendar la visita';
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  get Math() {
    return Math;
  }
}
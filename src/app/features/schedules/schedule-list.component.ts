import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../core/services/schedule.service';
import { PropertyService } from '../../core/services/property.service';
import { LocationService } from '../../core/services/location.service';
import { UserService } from '../../core/services/user.service';
import { Schedule, Property, Location, User } from '../../shared/models';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-2xl font-normal text-gray-900 mb-6">Horarios de Visitas Disponibles</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
            <input type="datetime-local" [(ngModel)]="filters.fechaInicio" (change)="applyFilters()" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
            <input type="datetime-local" [(ngModel)]="filters.fechaFin" (change)="applyFilters()" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
            <select [(ngModel)]="filters.ubicacionId" (change)="applyFilters()" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="schedules.length > 0">
        <div *ngFor="let schedule of schedules" 
             class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ getPropertyName(schedule.casaId) }}</h3>
            <p class="text-sm text-gray-600">{{ getVendedorName(schedule.vendedorId) }}</p>
          </div>
          
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"></path>
              </svg>
              {{ formatDate(schedule.fechaHoraInicio) }}
            </div>
            
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ formatTime(schedule.fechaHoraInicio) }} - {{ formatTime(schedule.fechaHoraFin) }}
            </div>
            
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {{ getPropertyLocation(schedule.casaId) }}
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Disponible
            </span>
            <button class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Agendar Visita
            </button>
          </div>
        </div>
      </div>

      <div class="text-center py-8 text-gray-500" *ngIf="schedules.length === 0 && !isLoading">
        {{ hasFilters() ? 'No se encontraron horarios disponibles con los filtros seleccionados.' : 'No hay horarios disponibles en este momento.' }}
      </div>

      <div class="text-center py-8" *ngIf="isLoading">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-500">Cargando horarios...</p>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-8" *ngIf="totalPages > 1">
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
  `
})
export class ScheduleListComponent {
  private scheduleService = inject(ScheduleService);
  private propertyService = inject(PropertyService);
  private locationService = inject(LocationService);
  private userService = inject(UserService);

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
    return date.toLocaleDateString('es-CO', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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

  get Math() {
    return Math;
  }
}
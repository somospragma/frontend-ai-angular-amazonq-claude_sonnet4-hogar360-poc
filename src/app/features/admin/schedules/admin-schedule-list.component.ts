import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../../core/services/schedule.service';
import { PropertyService } from '../../../core/services/property.service';
import { AuthService } from '../../../core/services/auth.service';
import { Schedule, Property } from '../../../shared/models';

@Component({
  selector: 'app-admin-schedule-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-normal text-gray-900">Horarios de Visitas</h1>
        <a *ngIf="authService.isVendedor()" 
           routerLink="/admin/schedules/create" 
           class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Crear Horario
        </a>
      </div>

      <div *ngIf="!authService.isVendedor()" class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
        <p class="text-sm text-yellow-800">Solo los vendedores pueden crear horarios de visitas.</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propiedad</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Inicio</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Fin</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let schedule of schedules">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ getPropertyName(schedule.casaId) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(schedule.fechaHoraInicio) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatTime(schedule.fechaHoraInicio) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatTime(schedule.fechaHoraFin) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                        [class]="getStatusClass(schedule)">
                    {{ getStatusLabel(schedule) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button *ngIf="authService.isVendedor() && canDelete(schedule)" 
                          (click)="deleteSchedule(schedule)"
                          class="text-red-600 hover:text-red-900 text-sm">
                    Eliminar
                  </button>
                  <span *ngIf="!canDelete(schedule)" class="text-gray-400 text-xs">No disponible</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="bg-white px-4 py-3 text-center text-sm text-gray-500" *ngIf="schedules.length === 0">
          No hay horarios programados.
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
export class AdminScheduleListComponent {
  private scheduleService = inject(ScheduleService);
  private propertyService = inject(PropertyService);
  public authService = inject(AuthService);

  schedules: Schedule[] = [];
  properties: Property[] = [];
  currentPage = 1;
  totalPages = 1;
  total = 0;

  constructor() {
    this.loadSchedules();
    this.loadProperties();
  }

  private loadSchedules(): void {
    const vendedorId = this.authService.currentUser()?.id || '';
    
    this.scheduleService.getSchedulesByVendedor(vendedorId, {
      page: this.currentPage,
      pageSize: 10
    }).subscribe({
      next: (response) => {
        this.schedules = response.schedules || [];
        this.totalPages = response.totalPages;
        this.total = response.total;
      },
      error: (error) => {
        console.error('Error loading schedules:', error);
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

  getPropertyName(casaId: string): string {
    const property = this.properties.find(p => p.id === casaId);
    return property?.nombre || 'Propiedad no encontrada';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }

  getStatusLabel(schedule: Schedule): string {
    const now = new Date();
    const startTime = new Date(schedule.fechaHoraInicio);
    const endTime = new Date(schedule.fechaHoraFin);

    if (endTime < now) return 'Finalizado';
    if (startTime <= now && endTime > now) return 'En curso';
    return 'Programado';
  }

  getStatusClass(schedule: Schedule): string {
    const now = new Date();
    const startTime = new Date(schedule.fechaHoraInicio);
    const endTime = new Date(schedule.fechaHoraFin);

    if (endTime < now) return 'bg-gray-100 text-gray-800';
    if (startTime <= now && endTime > now) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  }

  canDelete(schedule: Schedule): boolean {
    const now = new Date();
    const startTime = new Date(schedule.fechaHoraInicio);
    return startTime > now; // Solo se puede eliminar si no ha comenzado
  }

  deleteSchedule(schedule: Schedule): void {
    if (confirm('¿Estás seguro de que deseas eliminar este horario?')) {
      const vendedorId = this.authService.currentUser()?.id || '';
      
      this.scheduleService.deleteSchedule(schedule.id, vendedorId).subscribe({
        next: () => {
          this.loadSchedules();
        },
        error: (error) => {
          alert('Error al eliminar el horario: ' + error.message);
        }
      });
    }
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
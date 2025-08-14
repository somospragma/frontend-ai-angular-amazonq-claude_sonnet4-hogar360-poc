import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../core/services/location.service';
import { Location } from '../../shared/models';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-location-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-2xl font-normal text-gray-900 mb-6">Buscar Ubicaciones</h1>
        
        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <div class="flex-1 relative">
            <input type="text" 
                   [(ngModel)]="searchText"
                   (input)="onSearch()"
                   placeholder="Buscar por ciudad o departamento..."
                   class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          
          <select [(ngModel)]="sortBy" (change)="onSortChange()" 
                  class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="ciudad">Ordenar por Ciudad</option>
            <option value="departamento">Ordenar por Departamento</option>
          </select>
          
          <button (click)="toggleSortOrder()" 
                  class="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {{ sortOrder === 'asc' ? '↑ A-Z' : '↓ Z-A' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" *ngIf="locations.length > 0">
          <div *ngFor="let location of locations" 
               class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 class="font-medium text-gray-900 mb-2">{{ location.ciudad }}</h3>
            <p class="text-sm text-gray-600 mb-1">{{ location.departamento }}</p>
            <p class="text-xs text-gray-500 mb-2">{{ location.descripcionCiudad }}</p>
            <p class="text-xs text-gray-400">{{ location.descripcionDepartamento }}</p>
          </div>
        </div>

        <div class="text-center py-8 text-gray-500" *ngIf="locations.length === 0 && !isLoading">
          {{ searchText ? 'No se encontraron ubicaciones que coincidan con la búsqueda.' : 'Ingresa un término de búsqueda para encontrar ubicaciones.' }}
        </div>

        <div class="text-center py-8" *ngIf="isLoading">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-500">Buscando ubicaciones...</p>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-6" *ngIf="totalPages > 1">
          <div class="text-sm text-gray-700">
            Mostrando {{ (currentPage - 1) * 12 + 1 }} - {{ Math.min(currentPage * 12, total) }} de {{ total }} ubicaciones
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
export class LocationSearchComponent {
  private locationService = inject(LocationService);

  locations: Location[] = [];
  searchText = '';
  sortBy = 'ciudad';
  sortOrder = 'asc';
  currentPage = 1;
  totalPages = 1;
  total = 0;
  isLoading = false;

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadLocations();
    });
  }

  private loadLocations(): void {
    if (!this.searchText.trim()) {
      this.locations = [];
      this.total = 0;
      this.totalPages = 1;
      return;
    }

    this.isLoading = true;
    const options = {
      page: this.currentPage,
      pageSize: 12,
      search: this.searchText,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };

    this.locationService.getLocations(options).subscribe({
      next: (response) => {
        this.locations = response.locations || [];
        this.totalPages = response.totalPages;
        this.total = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading locations:', error);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchText);
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.loadLocations();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.currentPage = 1;
    this.loadLocations();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadLocations();
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
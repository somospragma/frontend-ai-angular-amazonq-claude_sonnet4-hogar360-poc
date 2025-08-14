import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../core/services/property.service';
import { CategoryService } from '../../core/services/category.service';
import { LocationService } from '../../core/services/location.service';
import { Property, Category, Location } from '../../shared/models';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-2xl font-normal text-gray-900 mb-6">Buscar Propiedades</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select [(ngModel)]="filters.categoriaId" (change)="applyFilters()" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas las categorías</option>
              <option *ngFor="let category of categories" [value]="category.id">{{ category.nombre }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
            <select [(ngModel)]="filters.ubicacionId" (change)="applyFilters()" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas las ubicaciones</option>
              <option *ngFor="let location of locations" [value]="location.id">{{ location.ciudad }}, {{ location.departamento }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Cuartos mínimos</label>
            <select [(ngModel)]="filters.minCuartos" (change)="applyFilters()" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Cualquier cantidad</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Baños mínimos</label>
            <select [(ngModel)]="filters.minBanos" (change)="applyFilters()" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Cualquier cantidad</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Precio mínimo</label>
            <input type="number" [(ngModel)]="filters.precioMin" (input)="applyFilters()" 
                   placeholder="0" min="0"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Precio máximo</label>
            <input type="number" [(ngModel)]="filters.precioMax" (input)="applyFilters()" 
                   placeholder="Sin límite" min="0"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <div class="flex space-x-2">
              <select [(ngModel)]="sortBy" (change)="applyFilters()" 
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="fechaPublicacion">Fecha</option>
                <option value="precio">Precio</option>
                <option value="cantidadCuartos">Cuartos</option>
                <option value="cantidadBanos">Baños</option>
              </select>
              <button (click)="toggleSortOrder()" 
                      class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </button>
            </div>
          </div>
        </div>
        
        <button (click)="clearFilters()" 
                class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
          Limpiar filtros
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="properties.length > 0">
        <div *ngFor="let property of properties" 
             class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div class="h-48 bg-gray-200 flex items-center justify-center">
            <span class="text-gray-500">Imagen no disponible</span>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ property.nombre }}</h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ property.descripcion }}</p>
            
            <div class="flex items-center justify-between mb-3">
              <span class="text-xl font-bold text-blue-600">\${{ formatPrice(property.precio) }}</span>
              <div class="flex items-center space-x-3 text-sm text-gray-600">
                <span>{{ property.cantidadCuartos }}C</span>
                <span>{{ property.cantidadBanos }}B</span>
              </div>
            </div>
            
            <div class="text-sm text-gray-600 space-y-1">
              <p><strong>Categoría:</strong> {{ getCategoryName(property.categoriaId) }}</p>
              <p><strong>Ubicación:</strong> {{ getLocationName(property.ubicacionId) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center py-8 text-gray-500" *ngIf="properties.length === 0 && !isLoading">
        No se encontraron propiedades que coincidan con los filtros seleccionados.
      </div>

      <div class="text-center py-8" *ngIf="isLoading">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-500">Cargando propiedades...</p>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-8" *ngIf="totalPages > 1">
        <div class="text-sm text-gray-700">
          Mostrando {{ (currentPage - 1) * 12 + 1 }} - {{ Math.min(currentPage * 12, total) }} de {{ total }} propiedades
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
export class PropertyListComponent {
  private propertyService = inject(PropertyService);
  private categoryService = inject(CategoryService);
  private locationService = inject(LocationService);

  properties: Property[] = [];
  categories: Category[] = [];
  locations: Location[] = [];
  
  filters = {
    categoriaId: '',
    ubicacionId: '',
    minCuartos: '',
    minBanos: '',
    precioMin: '',
    precioMax: ''
  };
  
  sortBy = 'fechaPublicacion';
  sortOrder = 'desc';
  currentPage = 1;
  totalPages = 1;
  total = 0;
  isLoading = false;

  constructor() {
    this.loadCategories();
    this.loadLocations();
    this.loadProperties();
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.categories || [];
      },
      error: (error) => {
        console.error('Error loading categories:', error);
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

  private loadProperties(): void {
    this.isLoading = true;
    const options = {
      page: this.currentPage,
      pageSize: 12,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      ...this.getFilterValues()
    };

    this.propertyService.getPublicProperties(options).subscribe({
      next: (response) => {
        this.properties = response.properties || [];
        this.totalPages = response.totalPages;
        this.total = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.isLoading = false;
      }
    });
  }

  private getFilterValues(): any {
    const filters: any = {};
    
    if (this.filters.categoriaId) filters.categoriaId = this.filters.categoriaId;
    if (this.filters.ubicacionId) filters.ubicacionId = this.filters.ubicacionId;
    if (this.filters.minCuartos) filters.minCuartos = parseInt(this.filters.minCuartos);
    if (this.filters.minBanos) filters.minBanos = parseInt(this.filters.minBanos);
    if (this.filters.precioMin) filters.precioMin = parseFloat(this.filters.precioMin);
    if (this.filters.precioMax) filters.precioMax = parseFloat(this.filters.precioMax);
    
    return filters;
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadProperties();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {
      categoriaId: '',
      ubicacionId: '',
      minCuartos: '',
      minBanos: '',
      precioMin: '',
      precioMax: ''
    };
    this.sortBy = 'fechaPublicacion';
    this.sortOrder = 'desc';
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProperties();
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

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.nombre || 'N/A';
  }

  getLocationName(locationId: string): string {
    const location = this.locations.find(l => l.id === locationId);
    return location ? `${location.ciudad}, ${location.departamento}` : 'N/A';
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-CO');
  }

  get Math() {
    return Math;
  }
}
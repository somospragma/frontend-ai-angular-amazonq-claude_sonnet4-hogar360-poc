import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../../core/services/property.service';
import { CategoryService } from '../../../core/services/category.service';
import { LocationService } from '../../../core/services/location.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Property, PropertyStatus, Category, Location, User } from '../../../shared/models';

@Component({
  selector: 'app-admin-property-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-normal text-gray-900">Propiedades</h1>
        <a *ngIf="authService.isVendedor()" 
           routerLink="/admin/properties/create" 
           class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Publicar Casa
        </a>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select [(ngModel)]="filters.categoriaId" (change)="applyFilters()" 
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas</option>
              <option *ngFor="let category of categories" [value]="category.id">{{ category.nombre }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <select [(ngModel)]="filters.ubicacionId" (change)="applyFilters()" 
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas</option>
              <option *ngFor="let location of locations" [value]="location.id">{{ location.ciudad }}, {{ location.departamento }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cuartos</label>
            <select [(ngModel)]="filters.minCuartos" (change)="applyFilters()" 
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Baños</label>
            <select [(ngModel)]="filters.minBanos" (change)="applyFilters()" 
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio mín</label>
            <input type="number" [(ngModel)]="filters.precioMin" (input)="applyFilters()" 
                   placeholder="0" min="0"
                   class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio máx</label>
            <input type="number" [(ngModel)]="filters.precioMax" (input)="applyFilters()" 
                   placeholder="Sin límite" min="0"
                   class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
            <select [(ngModel)]="sortBy" (change)="applyFilters()" 
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="fechaPublicacion">Fecha</option>
              <option value="precio">Precio</option>
              <option value="cantidadCuartos">Cuartos</option>
              <option value="cantidadBanos">Baños</option>
            </select>
          </div>
          
          <div class="flex items-end">
            <button (click)="toggleSortOrder()" 
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {{ sortOrder === 'asc' ? '↑ Ascendente' : '↓ Descendente' }}
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!authService.isVendedor()" class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <p class="text-sm text-blue-800">Puedes ver todas las propiedades. Solo los vendedores pueden publicar casas.</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Casa</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuartos/Baños</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Activa</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let property of properties; let i = index">
              <td class="px-6 py-4">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ property.nombre }}</div>
                  <div class="text-sm text-gray-500 truncate max-w-xs">{{ property.descripcion }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ getCategoryName(property.categoriaId) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ getLocationName(property.ubicacionId) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">\${{ formatPrice(property.precio) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ property.cantidadCuartos }}C / {{ property.cantidadBanos }}B</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ getVendedorName(property.vendedorId) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                      [class]="getStatusClass(property.estadoPublicacion)">
                  {{ getStatusLabel(property.estadoPublicacion) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(property.fechaPublicacionActiva) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <select *ngIf="authService.isVendedor() && property.vendedorId === authService.currentUser()?.id" 
                        [value]="property.estadoPublicacion"
                        (change)="updateStatus(property, $event)"
                        class="text-xs border border-gray-300 rounded px-2 py-1">
                  <option value="PUBLICADA">Publicada</option>
                  <option value="PUBLICACION_PAUSADA">Pausada</option>
                  <option value="TRANSACCION_CURSO">En Transacción</option>
                  <option value="TRANSACCION_FINALIZADA">Finalizada</option>
                </select>
                <span *ngIf="!authService.isVendedor() || property.vendedorId !== authService.currentUser()?.id" class="text-gray-400 text-xs">Solo lectura</span>
              </td>
            </tr>
          </tbody>
          </table>
        </div>
        
        <div class="bg-white px-4 py-3 text-center text-sm text-gray-500" *ngIf="properties.length === 0">
          No hay propiedades publicadas.
        </div>
        
        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200" *ngIf="totalPages > 1">
          <div class="text-sm text-gray-700">
            Mostrando {{ (currentPage - 1) * 10 + 1 }} - {{ Math.min(currentPage * 10, total) }} de {{ total }} propiedades
          </div>
          <nav class="flex space-x-1">
            <button (click)="goToPage(currentPage - 1)" 
                    [disabled]="currentPage === 1"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <button *ngFor="let page of getPageNumbers()" 
                    (click)="goToPage(page)"
                    [class]="page === currentPage ? 'px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-gray-300 rounded' : 'px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50'">
              {{ page }}
            </button>
            
            <button (click)="goToPage(currentPage + 1)" 
                    [disabled]="currentPage === totalPages"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  `
})
export class AdminPropertyListComponent {
  private propertyService = inject(PropertyService);
  private categoryService = inject(CategoryService);
  private locationService = inject(LocationService);
  private userService = inject(UserService);
  public authService = inject(AuthService);

  properties: Property[] = [];
  categories: Category[] = [];
  locations: Location[] = [];
  users: User[] = [];
  
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

  constructor() {
    this.loadProperties();
    this.loadCategories();
    this.loadLocations();
    this.loadUsers();
  }

  private loadProperties(): void {
    // Todos los usuarios ven todas las propiedades
    const options = {
      page: this.currentPage,
      pageSize: 10,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      ...this.getFilterValues()
    };
    
    this.propertyService.getProperties(options).subscribe({
      next: (response) => {
        this.properties = response.properties || [];
        this.totalPages = response.totalPages;
        this.total = response.total;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
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

  get Math() {
    return Math;
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

  private loadUsers(): void {
    // Cargar todos los usuarios para mostrar nombres de vendedores
    const stored = localStorage.getItem('hogar360_users');
    if (stored) {
      this.users = JSON.parse(stored);
    }
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.nombre || 'N/A';
  }

  getLocationName(locationId: string): string {
    const location = this.locations.find(l => l.id === locationId);
    return location ? `${location.ciudad}, ${location.departamento}` : 'N/A';
  }

  getVendedorName(vendedorId: string): string {
    const user = this.users.find(u => u.id === vendedorId);
    return user ? `${user.nombre} ${user.apellido}` : 'N/A';
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-CO');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  }

  getStatusLabel(status: PropertyStatus): string {
    const labels = {
      'PUBLICADA': 'Publicada',
      'PUBLICACION_PAUSADA': 'Pausada',
      'TRANSACCION_CURSO': 'En Transacción',
      'TRANSACCION_FINALIZADA': 'Finalizada'
    };
    return labels[status] || status;
  }

  getStatusClass(status: PropertyStatus): string {
    const classes = {
      'PUBLICADA': 'bg-green-100 text-green-800',
      'PUBLICACION_PAUSADA': 'bg-yellow-100 text-yellow-800',
      'TRANSACCION_CURSO': 'bg-blue-100 text-blue-800',
      'TRANSACCION_FINALIZADA': 'bg-gray-100 text-gray-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  updateStatus(property: Property, event: any): void {
    const newStatus = event.target.value as PropertyStatus;
    const vendedorId = this.authService.currentUser()?.id || '';
    
    this.propertyService.updatePropertyStatus(property.id, newStatus, vendedorId).subscribe({
      next: () => {
        property.estadoPublicacion = newStatus;
      },
      error: (error) => {
        console.error('Error updating status:', error);
        event.target.value = property.estadoPublicacion; // Revert
        alert('Error al actualizar el estado');
      }
    });
  }
}
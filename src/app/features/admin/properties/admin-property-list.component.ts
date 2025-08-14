import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { CategoryService } from '../../../core/services/category.service';
import { LocationService } from '../../../core/services/location.service';
import { AuthService } from '../../../core/services/auth.service';
import { Property, PropertyStatus, Category, Location } from '../../../shared/models';

@Component({
  selector: 'app-admin-property-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-normal text-gray-900">Mis Propiedades</h1>
        <a *ngIf="authService.isVendedor()" 
           routerLink="/admin/properties/create" 
           class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Publicar Casa
        </a>
      </div>

      <div *ngIf="!authService.isVendedor()" class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
        <p class="text-sm text-yellow-800">Solo los vendedores pueden publicar casas.</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Casa</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuartos/Baños</th>
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
        
        <div class="bg-white px-4 py-3 text-center text-sm text-gray-500" *ngIf="properties.length === 0">
          No hay propiedades publicadas.
        </div>
      </div>
    </div>
  `
})
export class AdminPropertyListComponent {
  private propertyService = inject(PropertyService);
  private categoryService = inject(CategoryService);
  private locationService = inject(LocationService);
  public authService = inject(AuthService);

  properties: Property[] = [];
  categories: Category[] = [];
  locations: Location[] = [];

  constructor() {
    this.loadProperties();
    this.loadCategories();
    this.loadLocations();
  }

  private loadProperties(): void {
    const vendedorId = this.authService.currentUser()?.id;
    const options = this.authService.isAdmin() ? {} : { vendedorId };
    
    this.propertyService.getProperties(options).subscribe({
      next: (response) => {
        this.properties = response.properties || [];
      },
      error: (error) => {
        console.error('Error loading properties:', error);
      }
    });
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
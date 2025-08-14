import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LocationService } from '../../../core/services/location.service';
import { AuthService } from '../../../core/services/auth.service';
import { Location } from '../../../shared/models';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-admin-location-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div>
      <h1 class="text-2xl font-normal text-gray-900 mb-6">{{ authService.isAdmin() ? 'Crear Ubicación' : 'Ubicaciones' }}</h1>
      
      <div *ngIf="authService.isAdmin()" class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <form [formGroup]="locationForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-md p-4">
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="ciudad" class="block text-sm font-normal text-gray-700 mb-2">
                Ciudad <span class="text-red-500">*</span>
              </label>
              <input id="ciudad" 
                     type="text" 
                     formControlName="ciudad"
                     maxlength="50"
                     class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                     [class.border-red-300]="locationForm.get('ciudad')?.invalid && locationForm.get('ciudad')?.touched"
                     placeholder="Nombre de la ciudad (máximo 50 caracteres)">
              <div class="mt-1">
                <div *ngIf="locationForm.get('ciudad')?.invalid && locationForm.get('ciudad')?.touched" class="text-sm text-red-600">
                  <span *ngIf="locationForm.get('ciudad')?.errors?.['required']">La ciudad es requerida</span>
                  <span *ngIf="locationForm.get('ciudad')?.errors?.['maxlength']">Máximo 50 caracteres</span>
                </div>
              </div>
            </div>

            <div>
              <label for="departamento" class="block text-sm font-normal text-gray-700 mb-2">
                Departamento <span class="text-red-500">*</span>
              </label>
              <input id="departamento" 
                     type="text" 
                     formControlName="departamento"
                     maxlength="50"
                     class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                     [class.border-red-300]="locationForm.get('departamento')?.invalid && locationForm.get('departamento')?.touched"
                     placeholder="Nombre del departamento (máximo 50 caracteres)">
              <div class="mt-1">
                <div *ngIf="locationForm.get('departamento')?.invalid && locationForm.get('departamento')?.touched" class="text-sm text-red-600">
                  <span *ngIf="locationForm.get('departamento')?.errors?.['required']">El departamento es requerido</span>
                  <span *ngIf="locationForm.get('departamento')?.errors?.['maxlength']">Máximo 50 caracteres</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label for="descripcionCiudad" class="block text-sm font-normal text-gray-700 mb-2">
              Descripción de la Ciudad <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <textarea id="descripcionCiudad" 
                        formControlName="descripcionCiudad"
                        maxlength="120"
                        rows="3"
                        class="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                        [class.border-red-300]="locationForm.get('descripcionCiudad')?.invalid && locationForm.get('descripcionCiudad')?.touched"
                        placeholder="Descripción de la ciudad"></textarea>
              <div class="absolute bottom-2 right-2 text-xs text-gray-500">
                {{ locationForm.get('descripcionCiudad')?.value?.length || 0 }}/120
              </div>
            </div>
            <div class="mt-1">
              <div *ngIf="locationForm.get('descripcionCiudad')?.invalid && locationForm.get('descripcionCiudad')?.touched" class="text-sm text-red-600">
                <span *ngIf="locationForm.get('descripcionCiudad')?.errors?.['required']">La descripción de la ciudad es requerida</span>
                <span *ngIf="locationForm.get('descripcionCiudad')?.errors?.['maxlength']">Máximo 120 caracteres</span>
              </div>
            </div>
          </div>

          <div>
            <label for="descripcionDepartamento" class="block text-sm font-normal text-gray-700 mb-2">
              Descripción del Departamento <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <textarea id="descripcionDepartamento" 
                        formControlName="descripcionDepartamento"
                        maxlength="120"
                        rows="3"
                        class="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                        [class.border-red-300]="locationForm.get('descripcionDepartamento')?.invalid && locationForm.get('descripcionDepartamento')?.touched"
                        placeholder="Descripción del departamento"></textarea>
              <div class="absolute bottom-2 right-2 text-xs text-gray-500">
                {{ locationForm.get('descripcionDepartamento')?.value?.length || 0 }}/120
              </div>
            </div>
            <div class="mt-1">
              <div *ngIf="locationForm.get('descripcionDepartamento')?.invalid && locationForm.get('descripcionDepartamento')?.touched" class="text-sm text-red-600">
                <span *ngIf="locationForm.get('descripcionDepartamento')?.errors?.['required']">La descripción del departamento es requerida</span>
                <span *ngIf="locationForm.get('descripcionDepartamento')?.errors?.['maxlength']">Máximo 120 caracteres</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button type="submit" 
                    [disabled]="locationForm.invalid || isLoading"
                    class="px-9 py-2 bg-blue-600 text-white text-sm font-normal rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="isLoading" class="mr-2">⏳</span>
              {{ isLoading ? 'Creando...' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
      
      <div *ngIf="!authService.isAdmin()" class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
        <p class="text-sm text-yellow-800">Solo los administradores pueden crear y eliminar ubicaciones.</p>
      </div>

      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium text-gray-900">Ubicaciones existentes</h2>
        <div class="flex space-x-3">
          <div class="relative">
            <input type="text" 
                   [(ngModel)]="searchText"
                   (input)="onSearch()"
                   placeholder="Buscar por ciudad o departamento..."
                   class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-64">
            <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <select [(ngModel)]="sortBy" (change)="onSortChange()" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="ciudad">Ordenar por Ciudad</option>
            <option value="departamento">Ordenar por Departamento</option>
          </select>
          <button (click)="toggleSortOrder()" class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            {{ sortOrder === 'asc' ? '↑ A-Z' : '↓ Z-A' }}
          </button>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción Ciudad</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción Departamento</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let location of locations; let i = index">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">#LOC-{{ 2025001 + i }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ location.ciudad }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ location.departamento }}</td>
              <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{{ location.descripcionCiudad }}</td>
              <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{{ location.descripcionDepartamento }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button *ngIf="authService.isAdmin()" 
                        (click)="deleteLocation(location)" 
                        [disabled]="isDeleting && deletingId === location.id"
                        class="text-red-600 hover:text-red-900 disabled:opacity-50">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
                <span *ngIf="!authService.isAdmin()" class="text-gray-400 text-xs">Solo lectura</span>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200" *ngIf="totalPages > 1">
          <div class="text-sm text-gray-700">
            Mostrando {{ (currentPage - 1) * 10 + 1 }} - {{ Math.min(currentPage * 10, total) }} de {{ total }} ubicaciones
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
        
        <div class="bg-white px-4 py-3 text-center text-sm text-gray-500" *ngIf="locations.length === 0">
          {{ searchText ? 'No se encontraron ubicaciones que coincidan con la búsqueda.' : 'No hay ubicaciones registradas.' }}
        </div>
      </div>
    </div>
  `
})
export class AdminLocationListComponent {
  private locationService = inject(LocationService);
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);

  locations: Location[] = [];
  isLoading = false;
  isDeleting = false;
  deletingId = '';
  errorMessage = '';
  successMessage = '';
  searchText = '';
  sortBy = 'ciudad';
  sortOrder = 'asc';
  currentPage = 1;
  totalPages = 1;
  total = 0;
  
  locationForm: FormGroup;
  private searchSubject = new Subject<string>();

  constructor() {
    this.locationForm = this.fb.group({
      ciudad: ['', [Validators.required, Validators.maxLength(50)]],
      departamento: ['', [Validators.required, Validators.maxLength(50)]],
      descripcionCiudad: ['', [Validators.required, Validators.maxLength(120)]],
      descripcionDepartamento: ['', [Validators.required, Validators.maxLength(120)]]
    });
    
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadLocations();
    });
    
    this.loadLocations();
  }

  private loadLocations(): void {
    const options = {
      page: this.currentPage,
      pageSize: 10,
      search: this.searchText,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };
    
    this.locationService.getLocations(options).subscribe({
      next: (response) => {
        this.locations = response.locations || [];
        this.totalPages = response.totalPages;
        this.total = response.total;
      },
      error: (error) => {
        console.error('Error loading locations:', error);
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

  onSubmit(): void {
    if (!this.authService.isAdmin()) {
      this.errorMessage = 'Solo los administradores pueden crear ubicaciones';
      return;
    }

    if (this.locationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.locationService.createLocation(this.locationForm.value).subscribe({
        next: (location) => {
          this.isLoading = false;
          this.successMessage = `Ubicación "${location.ciudad}, ${location.departamento}" creada exitosamente`;
          this.locationForm.reset();
          this.loadLocations();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al crear la ubicación';
        }
      });
    }
  }

  deleteLocation(location: Location): void {
    if (!this.authService.isAdmin()) {
      alert('Solo los administradores pueden eliminar ubicaciones');
      return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar la ubicación "${location.ciudad}, ${location.departamento}"?`)) {
      this.isDeleting = true;
      this.deletingId = location.id;

      this.locationService.deleteLocation(location.id).subscribe({
        next: () => {
          this.loadLocations();
          this.isDeleting = false;
          this.deletingId = '';
        },
        error: (error) => {
          console.error('Error al eliminar ubicación:', error);
          this.isDeleting = false;
          this.deletingId = '';
          alert('Error al eliminar la ubicación');
        }
      });
    }
  }
}
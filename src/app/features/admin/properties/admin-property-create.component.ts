import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { CategoryService } from '../../../core/services/category.service';
import { LocationService } from '../../../core/services/location.service';
import { AuthService } from '../../../core/services/auth.service';
import { Category, Location } from '../../../shared/models';

@Component({
  selector: 'app-admin-property-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <h1 class="text-2xl font-normal text-gray-900 mb-6">Publicar Casa</h1>
      
      <div class="bg-white rounded-lg shadow-sm p-6">
        <form [formGroup]="propertyForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-md p-4">
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="nombre" class="block text-sm font-normal text-gray-700 mb-2">
                Nombre <span class="text-red-500">*</span>
              </label>
              <input id="nombre" 
                     type="text" 
                     formControlName="nombre"
                     class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                     [class.border-red-300]="propertyForm.get('nombre')?.invalid && propertyForm.get('nombre')?.touched">
              <div *ngIf="propertyForm.get('nombre')?.invalid && propertyForm.get('nombre')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="propertyForm.get('nombre')?.errors?.['required']">El nombre es requerido</span>
              </div>
            </div>

            <div>
              <label for="precio" class="block text-sm font-normal text-gray-700 mb-2">
                Precio <span class="text-red-500">*</span>
              </label>
              <input id="precio" 
                     type="number" 
                     formControlName="precio"
                     min="0"
                     class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                     [class.border-red-300]="propertyForm.get('precio')?.invalid && propertyForm.get('precio')?.touched">
              <div *ngIf="propertyForm.get('precio')?.invalid && propertyForm.get('precio')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="propertyForm.get('precio')?.errors?.['required']">El precio es requerido</span>
                <span *ngIf="propertyForm.get('precio')?.errors?.['min']">El precio debe ser mayor a 0</span>
              </div>
            </div>
          </div>

          <div>
            <label for="descripcion" class="block text-sm font-normal text-gray-700 mb-2">
              Descripción <span class="text-red-500">*</span>
            </label>
            <textarea id="descripcion" 
                      formControlName="descripcion"
                      rows="3"
                      class="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                      [class.border-red-300]="propertyForm.get('descripcion')?.invalid && propertyForm.get('descripcion')?.touched"></textarea>
            <div *ngIf="propertyForm.get('descripcion')?.invalid && propertyForm.get('descripcion')?.touched" class="mt-1 text-sm text-red-600">
              <span *ngIf="propertyForm.get('descripcion')?.errors?.['required']">La descripción es requerida</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="categoriaId" class="block text-sm font-normal text-gray-700 mb-2">
                Categoría <span class="text-red-500">*</span>
              </label>
              <select id="categoriaId" 
                      formControlName="categoriaId"
                      class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      [class.border-red-300]="propertyForm.get('categoriaId')?.invalid && propertyForm.get('categoriaId')?.touched">
                <option value="">Seleccionar categoría</option>
                <option *ngFor="let category of categories" [value]="category.id">{{ category.nombre }}</option>
              </select>
              <div *ngIf="propertyForm.get('categoriaId')?.invalid && propertyForm.get('categoriaId')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="propertyForm.get('categoriaId')?.errors?.['required']">La categoría es requerida</span>
              </div>
            </div>

            <div>
              <label for="ubicacionId" class="block text-sm font-normal text-gray-700 mb-2">
                Ubicación <span class="text-red-500">*</span>
              </label>
              <select id="ubicacionId" 
                      formControlName="ubicacionId"
                      class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      [class.border-red-300]="propertyForm.get('ubicacionId')?.invalid && propertyForm.get('ubicacionId')?.touched">
                <option value="">Seleccionar ubicación</option>
                <option *ngFor="let location of locations" [value]="location.id">{{ location.ciudad }}, {{ location.departamento }}</option>
              </select>
              <div *ngIf="propertyForm.get('ubicacionId')?.invalid && propertyForm.get('ubicacionId')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="propertyForm.get('ubicacionId')?.errors?.['required']">La ubicación es requerida</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="cantidadCuartos" class="block text-sm font-normal text-gray-700 mb-2">
                Cuartos <span class="text-red-500">*</span>
              </label>
              <input id="cantidadCuartos" 
                     type="number" 
                     formControlName="cantidadCuartos"
                     min="1"
                     class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                     [class.border-red-300]="propertyForm.get('cantidadCuartos')?.invalid && propertyForm.get('cantidadCuartos')?.touched">
              <div *ngIf="propertyForm.get('cantidadCuartos')?.invalid && propertyForm.get('cantidadCuartos')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="propertyForm.get('cantidadCuartos')?.errors?.['required']">La cantidad de cuartos es requerida</span>
                <span *ngIf="propertyForm.get('cantidadCuartos')?.errors?.['min']">Mínimo 1 cuarto</span>
              </div>
            </div>

            <div>
              <label for="cantidadBanos" class="block text-sm font-normal text-gray-700 mb-2">
                Baños <span class="text-red-500">*</span>
              </label>
              <input id="cantidadBanos" 
                     type="number" 
                     formControlName="cantidadBanos"
                     min="1"
                     class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                     [class.border-red-300]="propertyForm.get('cantidadBanos')?.invalid && propertyForm.get('cantidadBanos')?.touched">
              <div *ngIf="propertyForm.get('cantidadBanos')?.invalid && propertyForm.get('cantidadBanos')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="propertyForm.get('cantidadBanos')?.errors?.['required']">La cantidad de baños es requerida</span>
                <span *ngIf="propertyForm.get('cantidadBanos')?.errors?.['min']">Mínimo 1 baño</span>
              </div>
            </div>

            <div>
              <label for="fechaPublicacionActiva" class="block text-sm font-normal text-gray-700 mb-2">
                Fecha Publicación Activa <span class="text-red-500">*</span>
              </label>
              <input id="fechaPublicacionActiva" 
                     type="date" 
                     formControlName="fechaPublicacionActiva"
                     [min]="minDate"
                     [max]="maxDate"
                     class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                     [class.border-red-300]="propertyForm.get('fechaPublicacionActiva')?.invalid && propertyForm.get('fechaPublicacionActiva')?.touched">
              <div *ngIf="propertyForm.get('fechaPublicacionActiva')?.invalid && propertyForm.get('fechaPublicacionActiva')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="propertyForm.get('fechaPublicacionActiva')?.errors?.['required']">La fecha es requerida</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" 
                    (click)="goBack()"
                    class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" 
                    [disabled]="propertyForm.invalid || isLoading"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="isLoading" class="mr-2">⏳</span>
              {{ isLoading ? 'Publicando...' : 'Publicar Casa' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminPropertyCreateComponent {
  private propertyService = inject(PropertyService);
  private categoryService = inject(CategoryService);
  private locationService = inject(LocationService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public authService = inject(AuthService);

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  categories: Category[] = [];
  locations: Location[] = [];
  minDate = '';
  maxDate = '';
  
  propertyForm: FormGroup;

  constructor() {
    this.setDateLimits();
    this.propertyForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      categoriaId: ['', [Validators.required]],
      cantidadCuartos: [1, [Validators.required, Validators.min(1)]],
      cantidadBanos: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      ubicacionId: ['', [Validators.required]],
      fechaPublicacionActiva: ['', [Validators.required]]
    });
    
    this.loadCategories();
    this.loadLocations();
  }

  private setDateLimits(): void {
    const today = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    
    this.minDate = today.toISOString().split('T')[0];
    this.maxDate = oneMonthLater.toISOString().split('T')[0];
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

  onSubmit(): void {
    if (!this.authService.isVendedor()) {
      this.errorMessage = 'Solo los vendedores pueden publicar casas';
      return;
    }

    if (this.propertyForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const vendedorId = this.authService.currentUser()?.id || '';
      const isVendedor = this.authService.isVendedor();

      this.propertyService.createProperty(this.propertyForm.value, vendedorId, isVendedor).subscribe({
        next: (property) => {
          this.isLoading = false;
          this.successMessage = `Casa "${property.nombre}" publicada exitosamente`;
          this.propertyForm.reset();
          setTimeout(() => {
            this.router.navigate(['/admin/properties']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al publicar la casa';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/properties']);
  }
}
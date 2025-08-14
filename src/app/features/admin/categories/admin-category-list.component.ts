import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { Category } from '../../../shared/models';
import { APP_CONSTANTS } from '../../../shared/constants/app.constants';

@Component({
  selector: 'app-admin-category-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <h1 class="text-2xl font-normal text-gray-900 mb-6">Crear Categoría</h1>
      
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-md p-4">
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>

          <div>
            <label for="nombre" class="block text-sm font-normal text-gray-700 mb-2">
              Nombre de la Categoría <span class="text-red-500">*</span>
            </label>
            <input id="nombre" 
                   type="text" 
                   formControlName="nombre"
                   maxlength="50"
                   class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                   [class.border-red-300]="categoryForm.get('nombre')?.invalid && categoryForm.get('nombre')?.touched"
                   placeholder="Escribe el nombre de la categoría (máximo 50 caracteres)">
            <div class="mt-1 flex justify-between">
              <div *ngIf="categoryForm.get('nombre')?.invalid && categoryForm.get('nombre')?.touched" class="text-sm text-red-600">
                <span *ngIf="categoryForm.get('nombre')?.errors?.['required']">El nombre es requerido</span>
                <span *ngIf="categoryForm.get('nombre')?.errors?.['maxlength']">Máximo 50 caracteres</span>
              </div>
            </div>
          </div>

          <div>
            <label for="descripcion" class="block text-sm font-normal text-gray-700 mb-2">
              Descripción <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <textarea id="descripcion" 
                        formControlName="descripcion"
                        maxlength="90"
                        rows="4"
                        class="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                        [class.border-red-300]="categoryForm.get('descripcion')?.invalid && categoryForm.get('descripcion')?.touched"
                        placeholder="Enter category description"></textarea>
              <div class="absolute bottom-2 right-2 text-xs text-gray-500">
                {{ categoryForm.get('descripcion')?.value?.length || 0 }}/90
              </div>
            </div>
            <div class="mt-1">
              <div *ngIf="categoryForm.get('descripcion')?.invalid && categoryForm.get('descripcion')?.touched" class="text-sm text-red-600">
                <span *ngIf="categoryForm.get('descripcion')?.errors?.['required']">La descripción es requerida</span>
                <span *ngIf="categoryForm.get('descripcion')?.errors?.['maxlength']">Máximo 90 caracteres</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button type="submit" 
                    [disabled]="categoryForm.invalid || isLoading"
                    class="px-9 py-2 bg-blue-600 text-white text-sm font-normal rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="isLoading" class="mr-2">⏳</span>
              {{ isLoading ? 'Creando...' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>

      <h2 class="text-lg font-medium text-gray-900 mb-4">Categorías existentes</h2>
      
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let category of categories; let i = index">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">#CAT-{{ 2025001 + i }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.nombre }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ category.descripcion }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button (click)="deleteCategory(category)" 
                        [disabled]="isDeleting && deletingId === category.id"
                        class="text-red-600 hover:text-red-900 disabled:opacity-50">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </td>
            </tr>
            <!-- Datos de ejemplo si no hay categorías -->
            <tr *ngIf="categories.length === 0">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">#CAT-2025001</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Casas de lujo</td>
              <td class="px-6 py-4 text-sm text-gray-600">Propiedades residenciales con acabados de lujo</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button class="text-red-600 hover:text-red-900">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </td>
            </tr>
            <tr *ngIf="categories.length === 0" class="border-t border-gray-200">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">#CAT-2025002</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Apartamentos</td>
              <td class="px-6 py-4 text-sm text-gray-600">Espacios modernos y urbanos</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button class="text-red-600 hover:text-red-900">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200">
          <nav class="flex space-x-1">
            <button class="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-gray-300 rounded">1</button>
            <button class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50">2</button>
            <button class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50">3</button>
            <button class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50">4</button>
            <button class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50">
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
export class AdminCategoryListComponent {
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);

  categories: Category[] = [];
  isLoading = false;
  isDeleting = false;
  deletingId = '';
  errorMessage = '';
  successMessage = '';
  
  categoryForm: FormGroup;

  constructor() {
    this.categoryForm = this.fb.group({
      nombre: ['', [
        Validators.required, 
        Validators.maxLength(APP_CONSTANTS.VALIDATION.MAX_CATEGORY_NAME_LENGTH)
      ]],
      descripcion: ['', [
        Validators.required, 
        Validators.maxLength(APP_CONSTANTS.VALIDATION.MAX_CATEGORY_DESCRIPTION_LENGTH)
      ]]
    });
    
    this.loadCategories();
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

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: (category) => {
          this.isLoading = false;
          this.successMessage = `Categoría "${category.nombre}" creada exitosamente`;
          this.categoryForm.reset();
          this.loadCategories();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al crear la categoría';
        }
      });
    }
  }

  deleteCategory(category: Category): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${category.nombre}"?`)) {
      this.isDeleting = true;
      this.deletingId = category.id;

      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.loadCategories();
          this.isDeleting = false;
          this.deletingId = '';
        },
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
          this.isDeleting = false;
          this.deletingId = '';
          alert('Error al eliminar la categoría');
        }
      });
    }
  }
}
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { APP_CONSTANTS } from '../../../shared/constants/app.constants';

@Component({
  selector: 'app-admin-create-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Crear Categoría</h1>
      </div>
        <div class="bg-white shadow rounded-lg p-6">
          <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
              <p class="text-sm text-red-600">{{ errorMessage }}</p>
            </div>

            <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-md p-4">
              <p class="text-sm text-green-600">{{ successMessage }}</p>
            </div>

            <div>
              <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la categoría *
              </label>
              <input id="nombre" 
                     type="text" 
                     formControlName="nombre"
                     maxlength="50"
                     class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                     [class.border-red-300]="categoryForm.get('nombre')?.invalid && categoryForm.get('nombre')?.touched"
                     placeholder="Ej: Lujo, Económica, Nueva">
              <div class="mt-1 flex justify-between">
                <div *ngIf="categoryForm.get('nombre')?.invalid && categoryForm.get('nombre')?.touched" class="text-sm text-red-600">
                  <span *ngIf="categoryForm.get('nombre')?.errors?.['required']">El nombre es requerido</span>
                  <span *ngIf="categoryForm.get('nombre')?.errors?.['maxlength']">Máximo 50 caracteres</span>
                </div>
                <span class="text-xs text-gray-500">
                  {{ categoryForm.get('nombre')?.value?.length || 0 }}/50
                </span>
              </div>
            </div>

            <div>
              <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea id="descripcion" 
                        formControlName="descripcion"
                        maxlength="90"
                        rows="3"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        [class.border-red-300]="categoryForm.get('descripcion')?.invalid && categoryForm.get('descripcion')?.touched"
                        placeholder="Describe las características de esta categoría"></textarea>
              <div class="mt-1 flex justify-between">
                <div *ngIf="categoryForm.get('descripcion')?.invalid && categoryForm.get('descripcion')?.touched" class="text-sm text-red-600">
                  <span *ngIf="categoryForm.get('descripcion')?.errors?.['required']">La descripción es requerida</span>
                  <span *ngIf="categoryForm.get('descripcion')?.errors?.['maxlength']">Máximo 90 caracteres</span>
                </div>
                <span class="text-xs text-gray-500">
                  {{ categoryForm.get('descripcion')?.value?.length || 0 }}/90
                </span>
              </div>
            </div>

            <div class="flex justify-end space-x-4">
              <button type="button" 
                      (click)="goBack()"
                      class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" 
                      [disabled]="categoryForm.invalid || isLoading"
                      class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50">
                <span *ngIf="isLoading" class="mr-2">⏳</span>
                {{ isLoading ? 'Creando...' : 'Crear Categoría' }}
              </button>
            </div>
          </form>
        </div>
      </div>
  `
})
export class AdminCreateCategoryComponent {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  categoryForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

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
          setTimeout(() => {
            this.router.navigate(['/admin/categories']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al crear la categoría';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/categories']);
  }
}
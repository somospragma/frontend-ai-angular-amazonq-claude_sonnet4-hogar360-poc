import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { Category } from '../../../shared/models';
import { APP_CONSTANTS } from '../../../shared/constants/app.constants';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-admin-category-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent],
  template: `
    <div class="space-y-6">
      <!-- Formulario de categoría -->
      <div *ngIf="showCreateForm || editingCategory" class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}
          </h3>
        </div>
        
        <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-3">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-md p-3">
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>

          <div>
            <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input id="nombre" 
                   type="text" 
                   formControlName="nombre"
                   maxlength="50"
                   class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                   [class.border-red-300]="categoryForm.get('nombre')?.invalid && categoryForm.get('nombre')?.touched">
            <div class="mt-1 flex justify-between">
              <div *ngIf="categoryForm.get('nombre')?.invalid && categoryForm.get('nombre')?.touched" class="text-xs text-red-600">
                <span *ngIf="categoryForm.get('nombre')?.errors?.['required']">Requerido</span>
                <span *ngIf="categoryForm.get('nombre')?.errors?.['maxlength']">Máximo 50 caracteres</span>
              </div>
              <span class="text-xs text-gray-500">{{ categoryForm.get('nombre')?.value?.length || 0 }}/50</span>
            </div>
          </div>

          <div>
            <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea id="descripcion" 
                      formControlName="descripcion"
                      maxlength="90"
                      rows="3"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      [class.border-red-300]="categoryForm.get('descripcion')?.invalid && categoryForm.get('descripcion')?.touched"></textarea>
            <div class="mt-1 flex justify-between">
              <div *ngIf="categoryForm.get('descripcion')?.invalid && categoryForm.get('descripcion')?.touched" class="text-xs text-red-600">
                <span *ngIf="categoryForm.get('descripcion')?.errors?.['required']">Requerido</span>
                <span *ngIf="categoryForm.get('descripcion')?.errors?.['maxlength']">Máximo 90 caracteres</span>
              </div>
              <span class="text-xs text-gray-500">{{ categoryForm.get('descripcion')?.value?.length || 0 }}/90</span>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" 
                    (click)="cancelForm()"
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" 
                    [disabled]="categoryForm.invalid || isLoading"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {{ isLoading ? 'Guardando...' : (editingCategory ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Lista de categorías -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">Categorías</h2>
            <button *ngIf="authService.isAdmin()" 
                    (click)="showCreateForm = !showCreateForm"
                    class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              {{ showCreateForm ? 'Cancelar' : '+ Nueva Categoría' }}
            </button>
          </div>
        </div>
          <div *ngIf="isLoading" class="flex justify-center py-8">
            <div class="text-gray-500">Cargando categorías...</div>
          </div>

          <div *ngIf="!isLoading" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th *ngIf="authService.isAdmin()" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let category of categories" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ category.nombre }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-600">{{ category.descripcion }}</div>
                  </td>
                  <td *ngIf="authService.isAdmin()" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button (click)="editCategory(category)" 
                            class="text-blue-600 hover:text-blue-900 mr-4">
                      Editar
                    </button>
                    <button (click)="deleteCategory(category)" 
                            [disabled]="isDeleting"
                            class="text-red-600 hover:text-red-900 disabled:opacity-50">
                      {{ isDeleting && deletingId === category.id ? 'Eliminando...' : 'Eliminar' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        <div *ngIf="!isLoading && categories.length === 0" class="text-center py-12">
          <div class="text-gray-500 mb-4">No hay categorías disponibles</div>
          <p class="text-gray-500 text-sm">
            {{ authService.isAdmin() ? 'Crea la primera categoría usando el botón superior' : 'Las categorías serán creadas por el administrador' }}
          </p>
        </div>
        
        <!-- Paginación -->
        <app-pagination 
          *ngIf="!isLoading"
          [currentPage]="currentPage"
          [totalPages]="totalPages"
          [total]="totalCategories"
          [pageSize]="pageSize"
          (pageChange)="onPageChange($event)">
        </app-pagination>
      </div>
    </div>
  `
})
export class AdminCategoryListComponent {
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);

  categories: Category[] = [];
  isLoading = true;
  isDeleting = false;
  deletingId = '';
  showCreateForm = false;
  editingCategory: Category | null = null;
  errorMessage = '';
  successMessage = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  totalCategories = 0;
  
  categoryForm: FormGroup;

  constructor() {
    this.categoryForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(APP_CONSTANTS.VALIDATION.MAX_CATEGORY_NAME_LENGTH)]],
      descripcion: ['', [Validators.required, Validators.maxLength(APP_CONSTANTS.VALIDATION.MAX_CATEGORY_DESCRIPTION_LENGTH)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.isLoading = true;
    
    const options = {
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.categoryService.getCategories(options).subscribe({
      next: (response) => {
        this.categories = response.categories;
        this.totalCategories = response.total;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.showCreateForm = false;
    this.categoryForm.patchValue({
      nombre: category.nombre,
      descripcion: category.descripcion
    });
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.categoryForm.value;
      
      if (this.editingCategory) {
        this.categoryService.updateCategory(this.editingCategory.id, formValue).subscribe({
          next: (category) => {
            this.loadCategories();
            this.successMessage = `Categoría "${category.nombre}" actualizada exitosamente`;
            this.isLoading = false;
            setTimeout(() => this.cancelForm(), 2000);
          },
          error: (error) => {
            this.errorMessage = error.message || 'Error al actualizar la categoría';
            this.isLoading = false;
          }
        });
      } else {
        this.categoryService.createCategory(formValue).subscribe({
          next: (category) => {
            this.loadCategories();
            this.successMessage = `Categoría "${category.nombre}" creada exitosamente`;
            this.isLoading = false;
            setTimeout(() => this.cancelForm(), 2000);
          },
          error: (error) => {
            this.errorMessage = error.message || 'Error al crear la categoría';
            this.isLoading = false;
          }
        });
      }
    }
  }

  cancelForm(): void {
    this.showCreateForm = false;
    this.editingCategory = null;
    this.categoryForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCategories();
  }
}
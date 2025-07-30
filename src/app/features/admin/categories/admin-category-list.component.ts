import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/models';

@Component({
  selector: 'app-admin-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
        <button routerLink="/admin/categories/create"
                class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
          + Nueva Categoría
        </button>
      </div>
        <div *ngIf="isLoading" class="flex justify-center py-8">
          <div class="text-gray-500">Cargando categorías...</div>
        </div>

        <div *ngIf="!isLoading" class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            <li *ngFor="let category of categories" class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-medium text-gray-900">{{ category.nombre }}</h3>
                    <span class="text-sm text-gray-500">ID: {{ category.id }}</span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600">{{ category.descripcion }}</p>
                </div>
                <div class="ml-4 flex-shrink-0 flex space-x-2">
                  <a [routerLink]="['/admin/categories/edit', category.id]" 
                     class="text-primary-600 hover:text-primary-900 text-sm font-medium">
                    Editar
                  </a>
                  <button (click)="deleteCategory(category)" 
                          [disabled]="isDeleting"
                          class="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50">
                    {{ isDeleting && deletingId === category.id ? 'Eliminando...' : 'Eliminar' }}
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div *ngIf="!isLoading && categories.length === 0" class="text-center py-12">
          <div class="text-gray-500 mb-4">No hay categorías disponibles</div>
          <button routerLink="/admin/categories/create"
                  class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
            Crear primera categoría
          </button>
        </div>

        <!-- Confirmación de eliminación -->
        <div *ngIf="isDeleting" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg">
            <p class="text-gray-900">Eliminando categoría...</p>
          </div>
        </div>
      </div>
  `
})
export class AdminCategoryListComponent {
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  isLoading = true;
  isDeleting = false;
  deletingId = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    // Cargar desde signal primero
    this.categories = this.categoryService.categories();
    
    // Luego hacer la llamada para simular carga
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  deleteCategory(category: Category): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${category.nombre}"?`)) {
      this.isDeleting = true;
      this.deletingId = category.id;

      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.categories = this.categoryService.categories();
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
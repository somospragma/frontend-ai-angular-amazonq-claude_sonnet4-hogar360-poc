import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/models';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Categorías de Inmuebles</h1>
        <p class="text-gray-600">Explora las diferentes categorías de propiedades disponibles</p>
      </div>

      <div *ngIf="isLoading" class="flex justify-center py-8">
        <div class="text-gray-500">Cargando categorías...</div>
      </div>

      <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let category of categories" 
             class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ category.nombre }}</h3>
          <p class="text-gray-600 text-sm">{{ category.descripcion }}</p>
        </div>
      </div>

      <div *ngIf="!isLoading && categories.length === 0" class="text-center py-12">
        <div class="text-gray-500 mb-4">No hay categorías disponibles</div>
        <p class="text-gray-500">Las categorías serán agregadas por el administrador.</p>
      </div>
    </div>
  `
})
export class CategoryListComponent {
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  isLoading = true;

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
}
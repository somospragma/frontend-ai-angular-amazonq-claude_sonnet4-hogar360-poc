import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Category, CreateCategoryRequest } from '../../shared/models';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private storageService = inject(StorageService);
  private readonly STORAGE_KEY = 'categories';
  
  private defaultCategories: Category[] = [
    { id: '1', nombre: 'Lujo', descripcion: 'Propiedades de alta gama con acabados premium' },
    { id: '2', nombre: 'Económica', descripcion: 'Propiedades accesibles para presupuestos ajustados' },
    { id: '3', nombre: 'Nueva', descripcion: 'Propiedades recién construidas o en construcción' }
  ];

  private categoriesSignal = signal<Category[]>(this.loadCategoriesFromStorage());
  public categories = this.categoriesSignal.asReadonly();

  private loadCategoriesFromStorage(): Category[] {
    const stored = this.storageService.getItem<Category[]>(this.STORAGE_KEY);
    return stored || this.defaultCategories;
  }

  private saveCategoriesToStorage(categories: Category[]): void {
    this.storageService.setItem(this.STORAGE_KEY, categories);
  }

  getCategories(): Observable<Category[]> {
    return of(this.categoriesSignal()).pipe(delay(500));
  }

  createCategory(request: CreateCategoryRequest): Observable<Category> {
    const categories = this.categoriesSignal();
    
    // Validar nombre único
    if (categories.some(cat => cat.nombre.toLowerCase() === request.nombre.toLowerCase())) {
      return throwError(() => new Error('El nombre de la categoría ya existe'));
    }

    // Validar longitudes
    if (request.nombre.length > APP_CONSTANTS.VALIDATION.MAX_CATEGORY_NAME_LENGTH) {
      return throwError(() => new Error(`El nombre no puede exceder ${APP_CONSTANTS.VALIDATION.MAX_CATEGORY_NAME_LENGTH} caracteres`));
    }

    if (request.descripcion.length > APP_CONSTANTS.VALIDATION.MAX_CATEGORY_DESCRIPTION_LENGTH) {
      return throwError(() => new Error(`La descripción no puede exceder ${APP_CONSTANTS.VALIDATION.MAX_CATEGORY_DESCRIPTION_LENGTH} caracteres`));
    }

    const newCategory: Category = {
      id: this.generateId(),
      nombre: request.nombre,
      descripcion: request.descripcion
    };

    return of(newCategory).pipe(
      delay(1000),
      map(category => {
        const updatedCategories = [...categories, category];
        this.categoriesSignal.set(updatedCategories);
        this.saveCategoriesToStorage(updatedCategories);
        return category;
      })
    );
  }

  updateCategory(id: string, request: CreateCategoryRequest): Observable<Category> {
    const categories = this.categoriesSignal();
    const categoryIndex = categories.findIndex(cat => cat.id === id);
    
    if (categoryIndex === -1) {
      return throwError(() => new Error('Categoría no encontrada'));
    }

    // Validar nombre único (excluyendo la categoría actual)
    if (categories.some(cat => cat.id !== id && cat.nombre.toLowerCase() === request.nombre.toLowerCase())) {
      return throwError(() => new Error('El nombre de la categoría ya existe'));
    }

    // Validar longitudes
    if (request.nombre.length > APP_CONSTANTS.VALIDATION.MAX_CATEGORY_NAME_LENGTH) {
      return throwError(() => new Error(`El nombre no puede exceder ${APP_CONSTANTS.VALIDATION.MAX_CATEGORY_NAME_LENGTH} caracteres`));
    }

    if (request.descripcion.length > APP_CONSTANTS.VALIDATION.MAX_CATEGORY_DESCRIPTION_LENGTH) {
      return throwError(() => new Error(`La descripción no puede exceder ${APP_CONSTANTS.VALIDATION.MAX_CATEGORY_DESCRIPTION_LENGTH} caracteres`));
    }

    const updatedCategory: Category = {
      id,
      nombre: request.nombre,
      descripcion: request.descripcion
    };

    return of(updatedCategory).pipe(
      delay(1000),
      map(category => {
        const updatedCategories = [...categories];
        updatedCategories[categoryIndex] = category;
        this.categoriesSignal.set(updatedCategories);
        this.saveCategoriesToStorage(updatedCategories);
        return category;
      })
    );
  }

  deleteCategory(id: string): Observable<boolean> {
    const categories = this.categoriesSignal();
    const categoryExists = categories.some(cat => cat.id === id);
    
    if (!categoryExists) {
      return throwError(() => new Error('Categoría no encontrada'));
    }

    return of(true).pipe(
      delay(500),
      map(() => {
        const updatedCategories = categories.filter(cat => cat.id !== id);
        this.categoriesSignal.set(updatedCategories);
        this.saveCategoriesToStorage(updatedCategories);
        return true;
      })
    );
  }

  getCategoryById(id: string): Category | null {
    return this.categoriesSignal().find(cat => cat.id === id) || null;
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
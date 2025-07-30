import { Routes } from '@angular/router';

export const ADMIN_CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-category-list.component').then(m => m.AdminCategoryListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./admin-create-category.component').then(m => m.AdminCreateCategoryComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./admin-edit-category.component').then(m => m.AdminEditCategoryComponent)
  }
];
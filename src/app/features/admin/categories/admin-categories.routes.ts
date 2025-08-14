import { Routes } from '@angular/router';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

const adminOnlyGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAdmin()) {
    return true;
  }
  router.navigate(['/admin/categories']);
  return false;
};

export const ADMIN_CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-category-list.component').then(m => m.AdminCategoryListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./admin-create-category.component').then(m => m.AdminCreateCategoryComponent),
    canActivate: [adminOnlyGuard]
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./admin-edit-category.component').then(m => m.AdminEditCategoryComponent),
    canActivate: [adminOnlyGuard]
  }
];
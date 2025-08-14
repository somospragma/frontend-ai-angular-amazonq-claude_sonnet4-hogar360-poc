import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { adminGuard } from '../../core/guards/auth.guard';
import { AuthService } from '../../core/services/auth.service';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'categories',
        loadChildren: () => import('./categories/admin-categories.routes').then(m => m.ADMIN_CATEGORIES_ROUTES)
      },
      {
        path: 'locations',
        loadComponent: () => import('./locations/admin-location-list.component').then(m => m.AdminLocationListComponent)
      },
      {
        path: 'users',
        loadChildren: () => import('./users/admin-users.routes').then(m => m.ADMIN_USERS_ROUTES)
      },
      {
        path: 'properties',
        loadChildren: () => import('./properties/admin-properties.routes').then(m => m.ADMIN_PROPERTIES_ROUTES)
      }
    ]
  }
];
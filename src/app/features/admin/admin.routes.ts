import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/auth.guard';

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
      }
    ]
  }
];
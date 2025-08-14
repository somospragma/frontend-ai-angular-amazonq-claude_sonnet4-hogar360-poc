import { Routes } from '@angular/router';
import { authGuard } from '../../../core/guards/auth.guard';

export const ADMIN_PROPERTIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-property-list.component').then(m => m.AdminPropertyListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'create',
    loadComponent: () => import('./admin-property-create.component').then(m => m.AdminPropertyCreateComponent),
    canActivate: [authGuard]
  }
];
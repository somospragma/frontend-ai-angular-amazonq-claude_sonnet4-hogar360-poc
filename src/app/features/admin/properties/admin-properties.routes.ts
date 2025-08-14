import { Routes } from '@angular/router';
import { adminGuard } from '../../../core/guards/auth.guard';

export const ADMIN_PROPERTIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-property-list.component').then(m => m.AdminPropertyListComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'create',
    loadComponent: () => import('./admin-property-create.component').then(m => m.AdminPropertyCreateComponent),
    canActivate: [adminGuard]
  }
];
import { Routes } from '@angular/router';
import { adminGuard } from '../../../core/guards/auth.guard';

export const ADMIN_USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-user-list.component').then(m => m.AdminUserListComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'create',
    loadComponent: () => import('./admin-user-create.component').then(m => m.AdminUserCreateComponent),
    canActivate: [adminGuard]
  }
];
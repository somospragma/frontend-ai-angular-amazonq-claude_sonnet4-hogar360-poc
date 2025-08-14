import { Routes } from '@angular/router';
import { authGuard } from '../../../core/guards/auth.guard';

export const ADMIN_SCHEDULES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-schedule-list.component').then(m => m.AdminScheduleListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'create',
    loadComponent: () => import('./admin-schedule-create.component').then(m => m.AdminScheduleCreateComponent),
    canActivate: [authGuard]
  },
  {
    path: 'available',
    loadComponent: () => import('./admin-public-schedule-list.component').then(m => m.AdminPublicScheduleListComponent),
    canActivate: [authGuard]
  }
];
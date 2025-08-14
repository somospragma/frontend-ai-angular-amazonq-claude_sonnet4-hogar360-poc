import { Routes } from '@angular/router';

export const SCHEDULES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./schedule-list.component').then(m => m.ScheduleListComponent)
  }
];
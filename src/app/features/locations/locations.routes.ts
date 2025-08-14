import { Routes } from '@angular/router';

export const LOCATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./location-search.component').then(m => m.LocationSearchComponent)
  }
];
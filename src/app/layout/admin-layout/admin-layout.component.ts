import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <!-- Header -->
      <nav class="bg-white border-b border-gray-200 h-14">
        <div class="flex items-center justify-between h-full px-3">
          <div class="flex items-center">
            <h1 class="text-xs text-black ml-2">Hogar 360</h1>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-sm text-gray-600">
              Bienvenido, {{ authService.currentUser()?.nombre }} 
              <span class="text-xs text-gray-500">({{ getRoleLabel(authService.currentUser()?.rol) }})</span>
            </span>
            <button (click)="logout()" class="text-sm text-red-600 hover:text-red-800">Cerrar sesión</button>
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span class="text-xs text-gray-600">{{ authService.currentUser()?.nombre?.charAt(0) }}</span>
            </div>
          </div>
        </div>
      </nav>

      <div class="flex">
        <!-- Sidebar -->
        <aside class="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div class="p-3">
            <div class="space-y-1">
              <a routerLink="/admin" 
                 routerLinkActive="bg-blue-50 text-blue-600"
                 [routerLinkActiveOptions]="{exact: true}"
                 class="flex items-center px-2 py-2 text-sm text-gray-600 rounded hover:bg-gray-50">
                <svg class="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                </svg>
                Dashboard
              </a>
              
              <a routerLink="/admin/categories" 
                 routerLinkActive="bg-blue-50 text-blue-600"
                 class="flex items-center px-2 py-2 text-sm text-gray-600 rounded hover:bg-gray-50">
                <svg class="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Categorías
              </a>
              
              <a routerLink="/admin/locations" 
                 routerLinkActive="bg-blue-50 text-blue-600"
                 class="flex items-center px-2 py-2 text-sm text-gray-600 rounded hover:bg-gray-50">
                <svg class="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Ubicaciones
              </a>
              
              <a routerLink="/admin/properties" 
                 routerLinkActive="bg-blue-50 text-blue-600"
                 class="flex items-center px-2 py-2 text-sm text-gray-600 rounded hover:bg-gray-50">
                <svg class="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h5"></path>
                </svg>
                Propiedades
              </a>
              
              <a routerLink="/admin/users" 
                 routerLinkActive="bg-blue-50 text-blue-600"
                 class="flex items-center px-2 py-2 text-sm text-gray-600 rounded hover:bg-gray-50">
                <svg class="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                Usuarios
              </a>
              
              <a href="#" class="flex items-center px-2 py-2 text-sm text-gray-600 rounded hover:bg-gray-50">
                <svg class="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Configuración
              </a>
            </div>
          </div>
        </aside>

        <!-- Main content -->
        <main class="flex-1 p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    window.location.href = '/';
  }

  goToSite(): void {
    window.location.href = '/';
  }

  getRoleLabel(role: any): string {
    const roleLabels: any = {
      'ADMIN': 'Administrador',
      'VENDEDOR': 'Vendedor',
      'COMPRADOR': 'Comprador'
    };
    return roleLabels[role] || role;
  }
}
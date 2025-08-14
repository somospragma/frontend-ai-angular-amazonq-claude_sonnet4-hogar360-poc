import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <div class="w-64 bg-white shadow-lg">
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 bg-blue-600">
          <h1 class="text-white text-xl font-bold">Hogar360</h1>
        </div>
        
        <!-- Navigation -->
        <nav class="mt-8">
          <div class="px-4 space-y-2">
            <a routerLink="/admin" 
               routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-600"
               [routerLinkActiveOptions]="{exact: true}"
               class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
              </svg>
              Dashboard
            </a>
            
            <a routerLink="/admin/categories" 
               routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-600"
               class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              Categorías
            </a>
          </div>
        </nav>
        
        <!-- User info -->
        <div class="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">
                {{ authService.currentUser()?.nombre?.charAt(0) }}
              </span>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-700">{{ authService.currentUser()?.nombre }}</p>
              <p class="text-xs text-gray-500">{{ getRoleLabel(authService.currentUser()?.rol) }}</p>
            </div>
            <button (click)="logout()" 
                    class="text-gray-400 hover:text-red-600 p-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top bar -->
        <header class="bg-white shadow-sm border-b border-gray-200 h-16">
          <div class="flex items-center justify-between h-full px-6">
            <h2 class="text-lg font-semibold text-gray-800">Panel de Administración</h2>
            <a (click)="goToSite()" 
               class="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver al sitio
            </a>
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-y-auto bg-gray-50 p-6">
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
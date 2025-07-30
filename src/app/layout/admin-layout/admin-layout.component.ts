import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Admin Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-4">
              <h1 class="text-xl font-bold text-gray-900">Hogar360 Admin</h1>
              <nav class="hidden md:flex space-x-6">
                <a routerLink="/admin" 
                   routerLinkActive="text-primary-600 border-primary-600"
                   [routerLinkActiveOptions]="{exact: true}"
                   class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent">
                  Dashboard
                </a>
                <a routerLink="/admin/categories" 
                   routerLinkActive="text-primary-600 border-primary-600"
                   class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent">
                  Categorías
                </a>
              </nav>
            </div>
            
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">
                {{ authService.currentUser()?.nombre }}
                <span class="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full ml-2">
                  Admin
                </span>
              </span>
              <button (click)="logout()" 
                      class="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">
                Cerrar Sesión
              </button>
              <a (click)="goToSite()" 
                 class="text-primary-600 hover:text-primary-700 text-sm font-medium cursor-pointer">
                ← Volver al sitio
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main>
        <router-outlet></router-outlet>
      </main>
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
}
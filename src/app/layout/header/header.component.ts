import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../shared/models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <a routerLink="/" class="text-2xl font-bold text-primary-600">
              Hogar360
            </a>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <a routerLink="/properties" 
               class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Propiedades
            </a>

            <a *ngIf="authService.isAuthenticated()" 
               routerLink="/admin" 
               class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Administración
            </a>
          </nav>

          <!-- Auth section -->
          <div class="flex items-center space-x-4">
            <!-- Not authenticated -->
            <ng-container *ngIf="!authService.isAuthenticated()">
              <a routerLink="/auth/login" 
                 class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Iniciar Sesión
              </a>
            </ng-container>

            <!-- Authenticated -->
            <ng-container *ngIf="authService.currentUser() as user">
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-700">
                  Hola, {{ user.nombre }}
                  <span class="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full ml-2">
                    {{ getRoleLabel(user.rol) }}
                  </span>
                </span>
                <button (click)="logout()" 
                        class="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">
                  Cerrar Sesión
                </button>
              </div>
            </ng-container>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button class="text-gray-700 hover:text-primary-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  public authService = inject(AuthService);
  
  logout(): void {
    this.authService.logout();
  }

  getRoleLabel(role: UserRole): string {
    const roleLabels = {
      [UserRole.ADMIN]: 'Admin',
      [UserRole.VENDEDOR]: 'Vendedor',
      [UserRole.COMPRADOR]: 'Comprador'
    };
    return roleLabels[role] || role;
  }
}
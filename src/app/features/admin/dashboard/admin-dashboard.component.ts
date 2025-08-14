import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
        <!-- Welcome -->
        <div class="bg-white rounded-lg shadow p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Bienvenido, {{ authService.currentUser()?.nombre }}</h1>
          <p class="text-gray-600">Gestiona tu plataforma inmobiliaria desde este panel</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Categorías</p>
                <p class="text-2xl font-bold text-gray-900">{{ categoryService.categories().length }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Propiedades</p>
                <p class="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Usuarios</p>
                <p class="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow p-6" *ngIf="authService.isAdmin()">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a routerLink="/admin/categories/create" 
               class="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-gray-900">Crear Categoría</h4>
                  <p class="text-xs text-gray-500">Nueva categoría de inmuebles</p>
                </div>
              </div>
            </a>

            <a routerLink="/admin/categories" 
               class="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-gray-900">Gestionar Categorías</h4>
                  <p class="text-xs text-gray-500">Ver y administrar categorías</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        <!-- Info for non-admin users -->
        <div class="bg-white rounded-lg shadow p-6" *ngIf="!authService.isAdmin()">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Tu Rol: {{ getRoleLabel(authService.currentUser()?.rol) }}</h3>
          <p class="text-gray-600">Bienvenido al panel de administración. Las funcionalidades disponibles dependen de tu rol de usuario.</p>
        </div>
      </div>
  `
})
export class AdminDashboardComponent {
  public authService = inject(AuthService);
  public categoryService = inject(CategoryService);

  getRoleLabel(role: any): string {
    const roleLabels: any = {
      'ADMIN': 'Administrador',
      'VENDEDOR': 'Vendedor', 
      'COMPRADOR': 'Comprador'
    };
    return roleLabels[role] || role;
  }
}
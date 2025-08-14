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
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

            <a routerLink="/admin/locations" 
               class="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-gray-900">Gestionar Ubicaciones</h4>
                  <p class="text-xs text-gray-500">Crear y administrar ubicaciones</p>
                </div>
              </div>
            </a>
            
            <a routerLink="/admin/categories" 
               class="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-gray-900">Ver Categorías</h4>
                  <p class="text-xs text-gray-500">Administrar categorías</p>
                </div>
              </div>
            </a>
            
            <a routerLink="/admin/users/create" 
               class="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-gray-900">Crear Vendedor</h4>
                  <p class="text-xs text-gray-500">Nuevo usuario vendedor</p>
                </div>
              </div>
            </a>
            
            <a *ngIf="authService.isVendedor()" 
               routerLink="/admin/properties/create" 
               class="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-gray-900">Publicar Casa</h4>
                  <p class="text-xs text-gray-500">Nueva propiedad</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        <!-- Info for non-admin users -->
        <div class="bg-white rounded-lg shadow p-6" *ngIf="!authService.isAdmin()">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Tu Rol: {{ getRoleLabel(authService.currentUser()?.rol) }}</h3>
          <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div class="flex">
              <svg class="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <div>
                <h4 class="text-sm font-medium text-yellow-800">Acceso Limitado</h4>
                <p class="text-sm text-yellow-700 mt-1">
                  Como {{ getRoleLabel(authService.currentUser()?.rol) }}, tienes acceso de solo lectura a ciertas secciones. 
                  Solo los administradores pueden crear, editar y eliminar ubicaciones y categorías.
                </p>
              </div>
            </div>
          </div>
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
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <nav class="max-w-7xl mx-auto px-20 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <h1 class="text-2xl font-normal text-blue-600">Hogar360</h1>
            </div>
            <div class="flex items-center space-x-8">
              <a routerLink="/properties" class="text-gray-600 hover:text-gray-900">Propiedades</a>
              <a routerLink="/schedules" class="text-gray-600 hover:text-gray-900">Horarios</a>
              <a href="#" class="text-gray-600 hover:text-gray-900">Vende</a>
              <a routerLink="/locations" class="text-gray-600 hover:text-gray-900">Ubicaciones</a>
              <a routerLink="/admin" class="text-gray-600 hover:text-gray-900">Administración</a>
              <a *ngIf="!authService.isAuthenticated()" routerLink="/auth/login" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-block text-center">
                Ingresar
              </a>
              <button *ngIf="authService.isAuthenticated()" (click)="logout()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Salir
              </button>
            </div>
          </div>
        </nav>
      </header>

      <!-- Hero Section -->
      <section class="py-24">
        <div class="max-w-7xl mx-auto px-20">
          <div class="text-center mb-16">
            <h1 class="text-4xl font-normal text-black mb-8">Encuentra tu casa perfecta</h1>
            
            <!-- Search Form -->
            <div class="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
              <div class="flex items-center space-x-6">
                <div class="flex-1">
                  <select class="w-full px-3 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Categoría</option>
                    <option>Casa</option>
                    <option>Apartamento</option>
                    <option>Local</option>
                  </select>
                </div>
                <div class="flex-1">
                  <select class="w-full px-3 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Buscar por ubicación</option>
                    <option>Bogotá</option>
                    <option>Medellín</option>
                    <option>Cali</option>
                  </select>
                </div>
                <button class="bg-blue-600 text-white px-12 py-3 rounded-lg hover:bg-blue-700">
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Properties Section -->
      <section class="pb-16">
        <div class="max-w-7xl mx-auto px-20">
          <!-- Filter Buttons -->
          <div class="flex items-center justify-end mb-8 space-x-2">
            <button class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
            </button>
            <button class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              </svg>
            </button>
          </div>

          <!-- Properties Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Property 1 -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div class="relative">
                <img src="assets/images/property1.jpg" alt="Casa a las afueras" class="w-full h-48 object-cover">
                <span class="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Venta</span>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-normal text-black mb-2">Casa a las afueras</h3>
                <p class="text-gray-600 mb-4">Medellín</p>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-2xl font-normal text-blue-600">$850,000</span>
                  <button class="p-2 hover:bg-gray-50 rounded">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>
                </div>
                <div class="flex items-center space-x-4 text-gray-600 text-sm">
                  <div class="flex items-center space-x-1">
                    <span>4</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                    </svg>
                  </div>
                  <div class="flex items-center space-x-1">
                    <span>3</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                    </svg>
                  </div>
                  <span>2,500 sq ft</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Property 2 -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div class="relative">
                <img src="assets/images/property2.jpg" alt="Apartamento en el centro" class="w-full h-48 object-cover">
                <span class="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">Renta</span>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-normal text-black mb-2">Apartamento en el centro</h3>
                <p class="text-gray-600 mb-4">Bogotá</p>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-2xl font-normal text-blue-600">$3,500/mo</span>
                  <button class="p-2 hover:bg-gray-50 rounded">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>
                </div>
                <div class="flex items-center space-x-4 text-gray-600 text-sm">
                  <div class="flex items-center space-x-1">
                    <span>2</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                    </svg>
                  </div>
                  <div class="flex items-center space-x-1">
                    <span>2</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                    </svg>
                  </div>
                  <span>1,200 sq ft</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Property 3 -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div class="relative">
                <img src="assets/images/property3.jpg" alt="Moderno apartamento" class="w-full h-48 object-cover">
                <span class="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Venta</span>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-normal text-black mb-2">Moderno apartamento</h3>
                <p class="text-gray-600 mb-4">Bogotá</p>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-2xl font-normal text-blue-600">$425,000</span>
                  <button class="p-2 hover:bg-gray-50 rounded">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>
                </div>
                <div class="flex items-center space-x-4 text-gray-600 text-sm">
                  <div class="flex items-center space-x-1">
                    <span>1</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                    </svg>
                  </div>
                  <div class="flex items-center space-x-1">
                    <span>1</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                    </svg>
                  </div>
                  <span>800 sq ft</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200">
        <div class="max-w-7xl mx-auto px-20 py-12">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Company Info -->
            <div>
              <h3 class="text-xl font-normal text-blue-600 mb-4">Hogar360</h3>
              <p class="text-gray-600">Tu partner en la búsqueda del espacio perfecto.</p>
            </div>
            
            <!-- Quick Access -->
            <div>
              <h4 class="font-medium text-black mb-4">Acceso rápido</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-600 hover:text-gray-900">Buscar Propiedades</a></li>
                <li><a href="#" class="text-gray-600 hover:text-gray-900">Publica tu propiedad</a></li>
              </ul>
            </div>
            
            <!-- Contact -->
            <div>
              <h4 class="font-medium text-black mb-4">Contactanos</h4>
              <ul class="space-y-2">
                <li class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span class="text-gray-600">1-800-HOGAR360</span>
                </li>
                <li class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span class="text-gray-600">info&#64;hogar360.com</span>
                </li>
                <li class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span class="text-gray-600">123 Real Estate Ave</span>
                </li>
              </ul>
            </div>
            
            <!-- Social Media -->
            <div>
              <h4 class="font-medium text-black mb-4">Siguenos</h4>
              <div class="flex space-x-3">
                <a href="#" class="w-5 h-5 text-gray-600 hover:text-gray-900">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" class="w-5 h-5 text-gray-600 hover:text-gray-900">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" class="w-5 h-5 text-gray-600 hover:text-gray-900">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a href="#" class="w-5 h-5 text-gray-600 hover:text-gray-900">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <!-- Copyright -->
          <div class="border-t border-gray-200 mt-8 pt-8 text-center">
            <p class="text-gray-600">© 2025 Hogar360. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class HomeComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
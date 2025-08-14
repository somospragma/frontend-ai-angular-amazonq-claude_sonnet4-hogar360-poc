import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../shared/models';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-normal text-gray-900">Usuarios Vendedores</h1>
        <a *ngIf="authService.isAdmin()" 
           routerLink="/admin/users/create" 
           class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Crear Vendedor
        </a>
      </div>

      <div *ngIf="!authService.isAdmin()" class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
        <p class="text-sm text-yellow-800">Solo los administradores pueden crear usuarios vendedores.</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Celular</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Nacimiento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let vendedor of vendedores; let i = index">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">#VEN-{{ 2025001 + i }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ vendedor.nombre }} {{ vendedor.apellido }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ vendedor.documento }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ vendedor.celular }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ vendedor.correo }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(vendedor.fechaNacimiento) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                      [class]="getPasswordStatusClass(vendedor.clave)">
                  {{ getPasswordStatus(vendedor.clave) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="bg-white px-4 py-3 text-center text-sm text-gray-500" *ngIf="vendedores.length === 0">
          No hay usuarios vendedores registrados.
        </div>
      </div>
    </div>
  `
})
export class AdminUserListComponent {
  private userService = inject(UserService);
  public authService = inject(AuthService);

  vendedores: User[] = [];

  constructor() {
    this.loadVendedores();
  }

  private loadVendedores(): void {
    this.userService.getVendedores().subscribe({
      next: (vendedores) => {
        this.vendedores = vendedores;
      },
      error: (error) => {
        console.error('Error loading vendedores:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  }

  getPasswordStatus(clave?: string): string {
    if (!clave) return 'Sin contraseña';
    return clave.startsWith('$2') ? 'Cifrada' : 'No cifrada';
  }

  getPasswordStatusClass(clave?: string): string {
    if (!clave) return 'bg-red-100 text-red-800';
    return clave.startsWith('$2') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  }
}
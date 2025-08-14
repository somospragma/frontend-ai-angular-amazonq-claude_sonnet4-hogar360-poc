import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <h1 class="text-2xl font-normal text-gray-900 mb-6">Crear Usuario Vendedor</h1>
      
      <div class="bg-white rounded-lg shadow-sm p-6">
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-md p-4">
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="nombre" class="block text-sm font-normal text-gray-700 mb-2">
                Nombre <span class="text-red-500">*</span>
              </label>
              <input id="nombre" 
                     type="text" 
                     formControlName="nombre"
                     class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                     [class.border-red-300]="userForm.get('nombre')?.invalid && userForm.get('nombre')?.touched">
              <div *ngIf="userForm.get('nombre')?.invalid && userForm.get('nombre')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="userForm.get('nombre')?.errors?.['required']">El nombre es requerido</span>
              </div>
            </div>

            <div>
              <label for="apellido" class="block text-sm font-normal text-gray-700 mb-2">
                Apellido <span class="text-red-500">*</span>
              </label>
              <input id="apellido" 
                     type="text" 
                     formControlName="apellido"
                     class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                     [class.border-red-300]="userForm.get('apellido')?.invalid && userForm.get('apellido')?.touched">
              <div *ngIf="userForm.get('apellido')?.invalid && userForm.get('apellido')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="userForm.get('apellido')?.errors?.['required']">El apellido es requerido</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="documento" class="block text-sm font-normal text-gray-700 mb-2">
                Documento de Identidad <span class="text-red-500">*</span>
              </label>
              <input id="documento" 
                     type="text" 
                     formControlName="documento"
                     class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                     [class.border-red-300]="userForm.get('documento')?.invalid && userForm.get('documento')?.touched">
              <div *ngIf="userForm.get('documento')?.invalid && userForm.get('documento')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="userForm.get('documento')?.errors?.['required']">El documento es requerido</span>
                <span *ngIf="userForm.get('documento')?.errors?.['pattern']">El documento debe ser numérico</span>
              </div>
            </div>

            <div>
              <label for="celular" class="block text-sm font-normal text-gray-700 mb-2">
                Celular <span class="text-red-500">*</span>
              </label>
              <input id="celular" 
                     type="text" 
                     formControlName="celular"
                     placeholder="+573001234567"
                     class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                     [class.border-red-300]="userForm.get('celular')?.invalid && userForm.get('celular')?.touched">
              <div *ngIf="userForm.get('celular')?.invalid && userForm.get('celular')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="userForm.get('celular')?.errors?.['required']">El celular es requerido</span>
                <span *ngIf="userForm.get('celular')?.errors?.['maxlength']">Máximo 13 caracteres</span>
                <span *ngIf="userForm.get('celular')?.errors?.['pattern']">Formato inválido (ej: +573001234567)</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="fechaNacimiento" class="block text-sm font-normal text-gray-700 mb-2">
                Fecha de Nacimiento <span class="text-red-500">*</span>
              </label>
              <input id="fechaNacimiento" 
                     type="date" 
                     formControlName="fechaNacimiento"
                     class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                     [class.border-red-300]="userForm.get('fechaNacimiento')?.invalid && userForm.get('fechaNacimiento')?.touched">
              <div *ngIf="userForm.get('fechaNacimiento')?.invalid && userForm.get('fechaNacimiento')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="userForm.get('fechaNacimiento')?.errors?.['required']">La fecha de nacimiento es requerida</span>
              </div>
            </div>

            <div>
              <label for="correo" class="block text-sm font-normal text-gray-700 mb-2">
                Correo Electrónico <span class="text-red-500">*</span>
              </label>
              <input id="correo" 
                     type="email" 
                     formControlName="correo"
                     class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                     [class.border-red-300]="userForm.get('correo')?.invalid && userForm.get('correo')?.touched">
              <div *ngIf="userForm.get('correo')?.invalid && userForm.get('correo')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="userForm.get('correo')?.errors?.['required']">El correo es requerido</span>
                <span *ngIf="userForm.get('correo')?.errors?.['email']">Formato de correo inválido</span>
              </div>
            </div>
          </div>

          <div>
            <label for="clave" class="block text-sm font-normal text-gray-700 mb-2">
              Contraseña <span class="text-red-500">*</span>
            </label>
            <input id="clave" 
                   type="password" 
                   formControlName="clave"
                   class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                   [class.border-red-300]="userForm.get('clave')?.invalid && userForm.get('clave')?.touched">
            <div *ngIf="userForm.get('clave')?.invalid && userForm.get('clave')?.touched" class="mt-1 text-sm text-red-600">
              <span *ngIf="userForm.get('clave')?.errors?.['required']">La contraseña es requerida</span>
              <span *ngIf="userForm.get('clave')?.errors?.['minlength']">Mínimo 6 caracteres</span>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" 
                    (click)="goBack()"
                    class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" 
                    [disabled]="userForm.invalid || isLoading"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="isLoading" class="mr-2">⏳</span>
              {{ isLoading ? 'Creando...' : 'Crear Vendedor' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminUserCreateComponent {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public authService = inject(AuthService);

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  userForm: FormGroup;

  constructor() {
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      documento: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      celular: ['', [Validators.required, Validators.maxLength(13), Validators.pattern(/^\+?\d+$/)]],
      fechaNacimiento: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (!this.authService.isAdmin()) {
      this.errorMessage = 'Solo los administradores pueden crear usuarios vendedores';
      return;
    }

    if (this.userForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.userService.createVendedor(this.userForm.value, this.authService.isAdmin()).subscribe({
        next: (user) => {
          this.isLoading = false;
          this.successMessage = `Usuario vendedor "${user.nombre} ${user.apellido}" creado exitosamente`;
          this.userForm.reset();
          setTimeout(() => {
            this.router.navigate(['/admin/users']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al crear el usuario vendedor';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/users']);
  }
}
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ingresa a tu cuenta de Hogar360
          </p>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 class="text-sm font-medium text-blue-800 mb-2">Credenciales de prueba:</h3>
          <div class="text-xs text-blue-700 space-y-1">
            <p><strong>Admin:</strong> admin[at]hogar360.com / password123</p>
            <p><strong>Vendedor:</strong> vendedor[at]hogar360.com / password123</p>
            <p><strong>Comprador:</strong> comprador[at]hogar360.com / password123</p>
          </div>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <input id="correo" 
                     type="email" 
                     formControlName="correo"
                     class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
                     placeholder="Correo electrónico">
            </div>
            <div>
              <input id="clave" 
                     type="password" 
                     formControlName="clave"
                     class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" 
                     placeholder="Contraseña">
            </div>
          </div>

          <div>
            <button type="submit" 
                    [disabled]="loginForm.invalid || isLoading"
                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="isLoading" class="mr-2">⏳</span>
              {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al iniciar sesión';
        }
      });
    }
  }
}
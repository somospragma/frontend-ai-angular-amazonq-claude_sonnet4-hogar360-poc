import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ScheduleService } from '../../../core/services/schedule.service';
import { PropertyService } from '../../../core/services/property.service';
import { AuthService } from '../../../core/services/auth.service';
import { Property } from '../../../shared/models';

@Component({
  selector: 'app-admin-schedule-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <h1 class="text-2xl font-normal text-gray-900 mb-6">Crear Horario de Visita</h1>
      
      <div class="bg-white rounded-lg shadow-sm p-6">
        <form [formGroup]="scheduleForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-md p-4">
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>

          <div>
            <label for="casaId" class="block text-sm font-normal text-gray-700 mb-2">
              Propiedad <span class="text-red-500">*</span>
            </label>
            <select id="casaId" 
                    formControlName="casaId"
                    class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    [class.border-red-300]="scheduleForm.get('casaId')?.invalid && scheduleForm.get('casaId')?.touched">
              <option value="">Seleccionar propiedad</option>
              <option *ngFor="let property of myProperties" [value]="property.id">{{ property.nombre }}</option>
            </select>
            <div *ngIf="scheduleForm.get('casaId')?.invalid && scheduleForm.get('casaId')?.touched" class="mt-1 text-sm text-red-600">
              <span *ngIf="scheduleForm.get('casaId')?.errors?.['required']">La propiedad es requerida</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="fecha" class="block text-sm font-normal text-gray-700 mb-2">
                Fecha <span class="text-red-500">*</span>
              </label>
              <input id="fecha" 
                     type="date" 
                     formControlName="fecha"
                     [min]="minDate"
                     [max]="maxDate"
                     class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                     [class.border-red-300]="scheduleForm.get('fecha')?.invalid && scheduleForm.get('fecha')?.touched">
              <div *ngIf="scheduleForm.get('fecha')?.invalid && scheduleForm.get('fecha')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="scheduleForm.get('fecha')?.errors?.['required']">La fecha es requerida</span>
              </div>
            </div>

            <div>
              <label for="horaInicio" class="block text-sm font-normal text-gray-700 mb-2">
                Hora de Inicio <span class="text-red-500">*</span>
              </label>
              <input id="horaInicio" 
                     type="time" 
                     formControlName="horaInicio"
                     class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                     [class.border-red-300]="scheduleForm.get('horaInicio')?.invalid && scheduleForm.get('horaInicio')?.touched">
              <div *ngIf="scheduleForm.get('horaInicio')?.invalid && scheduleForm.get('horaInicio')?.touched" class="mt-1 text-sm text-red-600">
                <span *ngIf="scheduleForm.get('horaInicio')?.errors?.['required']">La hora de inicio es requerida</span>
              </div>
            </div>
          </div>

          <div>
            <label for="horaFin" class="block text-sm font-normal text-gray-700 mb-2">
              Hora de Fin <span class="text-red-500">*</span>
            </label>
            <input id="horaFin" 
                   type="time" 
                   formControlName="horaFin"
                   class="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                   [class.border-red-300]="scheduleForm.get('horaFin')?.invalid && scheduleForm.get('horaFin')?.touched">
            <div *ngIf="scheduleForm.get('horaFin')?.invalid && scheduleForm.get('horaFin')?.touched" class="mt-1 text-sm text-red-600">
              <span *ngIf="scheduleForm.get('horaFin')?.errors?.['required']">La hora de fin es requerida</span>
            </div>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 class="text-sm font-medium text-blue-800 mb-2">Información importante:</h3>
            <ul class="text-xs text-blue-700 space-y-1">
              <li>• Solo puedes programar horarios dentro de los próximos 21 días</li>
              <li>• No puedes tener horarios superpuestos</li>
              <li>• Solo puedes crear horarios para tus propias propiedades</li>
              <li>• La hora de fin debe ser posterior a la hora de inicio</li>
            </ul>
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" 
                    (click)="goBack()"
                    class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" 
                    [disabled]="scheduleForm.invalid || isLoading"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="isLoading" class="mr-2">⏳</span>
              {{ isLoading ? 'Creando...' : 'Crear Horario' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminScheduleCreateComponent {
  private scheduleService = inject(ScheduleService);
  private propertyService = inject(PropertyService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public authService = inject(AuthService);

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  myProperties: Property[] = [];
  minDate = '';
  maxDate = '';
  
  scheduleForm: FormGroup;

  constructor() {
    this.setDateLimits();
    this.scheduleForm = this.fb.group({
      casaId: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      horaInicio: ['', [Validators.required]],
      horaFin: ['', [Validators.required]]
    });
    
    this.loadMyProperties();
  }

  private setDateLimits(): void {
    const today = new Date();
    const threeWeeksLater = new Date();
    threeWeeksLater.setDate(threeWeeksLater.getDate() + 21);
    
    this.minDate = today.toISOString().split('T')[0];
    this.maxDate = threeWeeksLater.toISOString().split('T')[0];
  }

  private loadMyProperties(): void {
    const vendedorId = this.authService.currentUser()?.id;
    
    this.propertyService.getProperties({ vendedorId }).subscribe({
      next: (response) => {
        this.myProperties = response.properties || [];
      },
      error: (error) => {
        console.error('Error loading properties:', error);
      }
    });
  }

  onSubmit(): void {
    if (!this.authService.isVendedor()) {
      this.errorMessage = 'Solo los vendedores pueden crear horarios de visitas';
      return;
    }

    if (this.scheduleForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.scheduleForm.value;
      const fechaHoraInicio = `${formData.fecha}T${formData.horaInicio}:00`;
      const fechaHoraFin = `${formData.fecha}T${formData.horaFin}:00`;

      const scheduleData = {
        casaId: formData.casaId,
        fechaHoraInicio,
        fechaHoraFin
      };

      const vendedorId = this.authService.currentUser()?.id || '';
      const isVendedor = this.authService.isVendedor();

      this.scheduleService.createSchedule(scheduleData, vendedorId, isVendedor).subscribe({
        next: (schedule) => {
          this.isLoading = false;
          this.successMessage = 'Horario creado exitosamente';
          this.scheduleForm.reset();
          setTimeout(() => {
            this.router.navigate(['/admin/schedules']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al crear el horario';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/schedules']);
  }
}
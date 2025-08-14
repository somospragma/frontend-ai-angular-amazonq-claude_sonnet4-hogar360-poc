import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Location, CreateLocationRequest } from '../../shared/models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly STORAGE_KEY = 'hogar360_locations';
  private locations: Location[] = [];
  private authService = inject(AuthService);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.locations = JSON.parse(stored);
    } else {
      // Datos iniciales
      this.locations = [
        {
          id: '1',
          ciudad: 'Bogotá',
          departamento: 'Cundinamarca',
          descripcionCiudad: 'Capital de Colombia, centro económico y político del país',
          descripcionDepartamento: 'Departamento central de Colombia, región andina'
        },
        {
          id: '2',
          ciudad: 'Medellín',
          departamento: 'Antioquia',
          descripcionCiudad: 'Ciudad de la eterna primavera, centro industrial del país',
          descripcionDepartamento: 'Departamento del noroeste de Colombia, región paisa'
        }
      ];
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.locations));
  }

  getLocations(options?: any): Observable<{locations: Location[], total: number, page: number, totalPages: number}> {
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedLocations = this.locations.slice(startIndex, endIndex);
    const totalPages = Math.ceil(this.locations.length / pageSize);

    return of({
      locations: paginatedLocations,
      total: this.locations.length,
      page,
      totalPages
    }).pipe(delay(500));
  }

  createLocation(locationData: CreateLocationRequest): Observable<Location> {
    // Validar rol de administrador
    if (!this.authService.isAdmin()) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Solo los administradores pueden crear ubicaciones'));
        }, 1000);
      });
    }

    // Validar que el nombre del departamento no se repita
    const departamentoExiste = this.locations.some(
      loc => loc.departamento.toLowerCase() === locationData.departamento.toLowerCase()
    );
    
    if (departamentoExiste) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error(`El departamento "${locationData.departamento}" ya existe`));
        }, 1000);
      });
    }
    
    const newLocation: Location = {
      id: Date.now().toString(),
      ...locationData
    };
    
    this.locations.push(newLocation);
    this.saveToStorage();
    
    return of(newLocation).pipe(delay(1000));
  }

  updateLocation(id: string, locationData: CreateLocationRequest): Observable<Location> {
    // Validar rol de administrador
    if (!this.authService.isAdmin()) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Solo los administradores pueden actualizar ubicaciones'));
        }, 1000);
      });
    }

    const index = this.locations.findIndex(loc => loc.id === id);
    if (index === -1) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Ubicación no encontrada'));
        }, 1000);
      });
    }
    
    // Validar que el nombre del departamento no se repita (excluyendo el actual)
    const departamentoExiste = this.locations.some(
      (loc, i) => i !== index && loc.departamento.toLowerCase() === locationData.departamento.toLowerCase()
    );
    
    if (departamentoExiste) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error(`El departamento "${locationData.departamento}" ya existe`));
        }, 1000);
      });
    }
    
    this.locations[index] = { ...this.locations[index], ...locationData };
    this.saveToStorage();
    return of(this.locations[index]).pipe(delay(1000));
  }

  deleteLocation(id: string): Observable<void> {
    // Validar rol de administrador
    if (!this.authService.isAdmin()) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Solo los administradores pueden eliminar ubicaciones'));
        }, 500);
      });
    }

    const index = this.locations.findIndex(loc => loc.id === id);
    if (index !== -1) {
      this.locations.splice(index, 1);
      this.saveToStorage();
      return of(void 0).pipe(delay(500));
    }
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.error(new Error('Ubicación no encontrada'));
      }, 500);
    });
  }
}
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Property, PropertyStatus, CreatePropertyRequest } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private readonly STORAGE_KEY = 'hogar360_properties';
  private properties: Property[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.properties = JSON.parse(stored);
    } else {
      this.properties = [];
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.properties));
  }

  createProperty(propertyData: CreatePropertyRequest, vendedorId: string, isVendedor: boolean = false): Observable<Property> {
    // Validar rol de vendedor (solo vendedores, no admin)
    if (!isVendedor) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Solo los vendedores pueden publicar casas'));
        }, 1000);
      });
    }

    // Validar fecha de publicación activa (no puede exceder un mes)
    const fechaActiva = new Date(propertyData.fechaPublicacionActiva);
    const fechaActual = new Date();
    const unMesDespues = new Date();
    unMesDespues.setMonth(unMesDespues.getMonth() + 1);

    if (fechaActiva > unMesDespues) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('La fecha de publicación activa no puede exceder un mes de la fecha actual'));
        }, 1000);
      });
    }

    const newProperty: Property = {
      id: Date.now().toString(),
      nombre: propertyData.nombre,
      descripcion: propertyData.descripcion,
      categoriaId: propertyData.categoriaId,
      cantidadCuartos: propertyData.cantidadCuartos,
      cantidadBanos: propertyData.cantidadBanos,
      precio: propertyData.precio,
      ubicacionId: propertyData.ubicacionId,
      fechaPublicacionActiva: propertyData.fechaPublicacionActiva,
      estadoPublicacion: PropertyStatus.PUBLICADA,
      fechaPublicacion: new Date().toISOString(),
      vendedorId: vendedorId
    };

    this.properties.push(newProperty);
    this.saveToStorage();

    return of(newProperty).pipe(delay(1000));
  }

  getProperties(options?: any): Observable<{properties: Property[], total: number, page: number, totalPages: number}> {
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 10;
    const vendedorId = options?.vendedorId;
    
    let filteredProperties = [...this.properties];
    
    // Filtrar por vendedor si se especifica
    if (vendedorId) {
      filteredProperties = filteredProperties.filter(p => p.vendedorId === vendedorId);
    }
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredProperties.length / pageSize);

    return of({
      properties: paginatedProperties,
      total: filteredProperties.length,
      page,
      totalPages
    }).pipe(delay(500));
  }

  updatePropertyStatus(id: string, status: PropertyStatus, vendedorId: string): Observable<Property> {
    const property = this.properties.find(p => p.id === id);
    
    if (!property) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Propiedad no encontrada'));
        }, 500);
      });
    }

    if (property.vendedorId !== vendedorId) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Solo puedes modificar tus propias propiedades'));
        }, 500);
      });
    }

    property.estadoPublicacion = status;
    this.saveToStorage();

    return of(property).pipe(delay(500));
  }
}
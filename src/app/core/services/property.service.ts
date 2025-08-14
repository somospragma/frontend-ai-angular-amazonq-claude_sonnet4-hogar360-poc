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
      // Propiedades de ejemplo
      this.properties = [
        {
          id: '1',
          nombre: 'Casa Moderna en Zona Norte',
          descripcion: 'Hermosa casa de dos pisos con acabados de lujo, jardín amplio y garaje para dos vehículos.',
          categoriaId: '1', // Asumiendo que existe una categoría con ID 1
          cantidadCuartos: 4,
          cantidadBanos: 3,
          precio: 850000000,
          ubicacionId: '1', // Asumiendo que existe una ubicación con ID 1
          fechaPublicacionActiva: new Date().toISOString().split('T')[0],
          estadoPublicacion: PropertyStatus.PUBLICADA,
          fechaPublicacion: new Date().toISOString(),
          vendedorId: '2' // ID del vendedor por defecto
        },
        {
          id: '2',
          nombre: 'Apartamento Centro Histórico',
          descripcion: 'Acogedor apartamento en el corazón de la ciudad, cerca de transporte público y centros comerciales.',
          categoriaId: '2', // Asumiendo que existe una categoría con ID 2
          cantidadCuartos: 2,
          cantidadBanos: 2,
          precio: 420000000,
          ubicacionId: '2', // Asumiendo que existe una ubicación con ID 2
          fechaPublicacionActiva: new Date().toISOString().split('T')[0],
          estadoPublicacion: PropertyStatus.PUBLICADA,
          fechaPublicacion: new Date().toISOString(),
          vendedorId: '2' // ID del vendedor por defecto
        },
        {
          id: '3',
          nombre: 'Casa Campestre con Piscina',
          descripcion: 'Espectacular casa campestre con piscina, zona BBQ y amplios espacios verdes para disfrutar en familia.',
          categoriaId: '1',
          cantidadCuartos: 5,
          cantidadBanos: 4,
          precio: 1200000000,
          ubicacionId: '1',
          fechaPublicacionActiva: new Date().toISOString().split('T')[0],
          estadoPublicacion: PropertyStatus.PUBLICADA,
          fechaPublicacion: new Date().toISOString(),
          vendedorId: '2'
        }
      ];
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
    const sortBy = options?.sortBy || 'fechaPublicacion';
    const sortOrder = options?.sortOrder || 'desc';
    const categoriaId = options?.categoriaId;
    const ubicacionId = options?.ubicacionId;
    const minCuartos = options?.minCuartos;
    const minBanos = options?.minBanos;
    const precioMin = options?.precioMin;
    const precioMax = options?.precioMax;
    
    let filteredProperties = [...this.properties];
    
    // Filtrar por vendedor si se especifica
    if (vendedorId) {
      filteredProperties = filteredProperties.filter(p => p.vendedorId === vendedorId);
    }
    
    // Aplicar filtros adicionales
    if (categoriaId) {
      filteredProperties = filteredProperties.filter(p => p.categoriaId === categoriaId);
    }
    
    if (ubicacionId) {
      filteredProperties = filteredProperties.filter(p => p.ubicacionId === ubicacionId);
    }
    
    if (minCuartos) {
      filteredProperties = filteredProperties.filter(p => p.cantidadCuartos >= minCuartos);
    }
    
    if (minBanos) {
      filteredProperties = filteredProperties.filter(p => p.cantidadBanos >= minBanos);
    }
    
    if (precioMin) {
      filteredProperties = filteredProperties.filter(p => p.precio >= precioMin);
    }
    
    if (precioMax) {
      filteredProperties = filteredProperties.filter(p => p.precio <= precioMax);
    }
    
    // Ordenar
    filteredProperties.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'precio':
          aValue = a.precio;
          bValue = b.precio;
          break;
        case 'cantidadCuartos':
          aValue = a.cantidadCuartos;
          bValue = b.cantidadCuartos;
          break;
        case 'cantidadBanos':
          aValue = a.cantidadBanos;
          bValue = b.cantidadBanos;
          break;
        default:
          aValue = new Date(a.fechaPublicacion).getTime();
          bValue = new Date(b.fechaPublicacion).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
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

  getPublicProperties(options?: any): Observable<{properties: Property[], total: number, page: number, totalPages: number}> {
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 12;
    const sortBy = options?.sortBy || 'fechaPublicacion';
    const sortOrder = options?.sortOrder || 'desc';
    const categoriaId = options?.categoriaId;
    const ubicacionId = options?.ubicacionId;
    const minCuartos = options?.minCuartos;
    const minBanos = options?.minBanos;
    const precioMin = options?.precioMin;
    const precioMax = options?.precioMax;
    
    let filteredProperties = this.properties.filter(property => {
      // Solo mostrar casas publicadas
      if (property.estadoPublicacion !== PropertyStatus.PUBLICADA) return false;
      
      // Solo mostrar casas cuya fecha de publicación activa sea mayor a la fecha actual
      const fechaActiva = new Date(property.fechaPublicacionActiva);
      const fechaActual = new Date();
      if (fechaActiva > fechaActual) return false;
      
      return true;
    });
    
    // Aplicar filtros
    if (categoriaId) {
      filteredProperties = filteredProperties.filter(p => p.categoriaId === categoriaId);
    }
    
    if (ubicacionId) {
      filteredProperties = filteredProperties.filter(p => p.ubicacionId === ubicacionId);
    }
    
    if (minCuartos) {
      filteredProperties = filteredProperties.filter(p => p.cantidadCuartos >= minCuartos);
    }
    
    if (minBanos) {
      filteredProperties = filteredProperties.filter(p => p.cantidadBanos >= minBanos);
    }
    
    if (precioMin) {
      filteredProperties = filteredProperties.filter(p => p.precio >= precioMin);
    }
    
    if (precioMax) {
      filteredProperties = filteredProperties.filter(p => p.precio <= precioMax);
    }
    
    // Ordenar
    filteredProperties.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'precio':
          aValue = a.precio;
          bValue = b.precio;
          break;
        case 'cantidadCuartos':
          aValue = a.cantidadCuartos;
          bValue = b.cantidadCuartos;
          break;
        case 'cantidadBanos':
          aValue = a.cantidadBanos;
          bValue = b.cantidadBanos;
          break;
        default:
          aValue = new Date(a.fechaPublicacion).getTime();
          bValue = new Date(b.fechaPublicacion).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
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
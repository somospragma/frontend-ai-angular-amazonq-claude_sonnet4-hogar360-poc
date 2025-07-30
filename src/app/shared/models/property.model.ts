export interface Property {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  cantidadCuartos: number;
  cantidadBanos: number;
  precio: number;
  ubicacion: {
    ciudad: string;
    departamento: string;
  };
  fechaPublicacionActiva: string;
  estado: PropertyStatus;
  fechaPublicacion: string;
  vendedorId: string;
}

export enum PropertyStatus {
  PUBLICADA = 'PUBLICADA',
  PUBLICACION_PAUSADA = 'PUBLICACION_PAUSADA',
  TRANSACCION_CURSO = 'TRANSACCION_CURSO',
  TRANSACCION_FINALIZADA = 'TRANSACCION_FINALIZADA'
}

export interface CreatePropertyRequest {
  nombre: string;
  descripcion: string;
  categoriaId: string;
  cantidadCuartos: number;
  cantidadBanos: number;
  precio: number;
  ubicacionId: string;
  fechaPublicacionActiva: string;
}
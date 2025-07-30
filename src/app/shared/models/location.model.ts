export interface Location {
  id: string;
  ciudad: string;
  departamento: string;
  descripcionCiudad: string;
  descripcionDepartamento: string;
}

export interface CreateLocationRequest {
  ciudad: string;
  departamento: string;
  descripcionCiudad: string;
  descripcionDepartamento: string;
}
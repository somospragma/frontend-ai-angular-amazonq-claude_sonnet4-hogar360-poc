export interface User {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  celular: string;
  fechaNacimiento: string;
  correo: string;
  rol: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  VENDEDOR = 'vendedor',
  COMPRADOR = 'comprador'
}

export interface LoginRequest {
  correo: string;
  clave: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
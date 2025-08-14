import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, UserRole, CreateUserRequest } from '../../shared/models';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'hogar360_users';
  private users: User[] = [];
  private cryptoService = inject(CryptoService);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.users = JSON.parse(stored);
    } else {
      // Usuarios iniciales con contraseñas cifradas
      const hashedPassword = this.cryptoService.hashPassword('password123');
      this.users = [
        {
          id: '1',
          nombre: 'Admin',
          apellido: 'Sistema',
          documento: '12345678',
          celular: '+573001234567',
          fechaNacimiento: '1990-01-01',
          correo: 'admin@hogar360.com',
          clave: hashedPassword,
          rol: UserRole.ADMIN
        },
        {
          id: '2',
          nombre: 'Juan',
          apellido: 'Vendedor',
          documento: '87654321',
          celular: '+573007654321',
          fechaNacimiento: '1985-05-15',
          correo: 'vendedor@hogar360.com',
          clave: hashedPassword,
          rol: UserRole.VENDEDOR
        },
        {
          id: '3',
          nombre: 'María',
          apellido: 'Compradora',
          documento: '11223344',
          celular: '+573009876543',
          fechaNacimiento: '1992-08-20',
          correo: 'comprador@hogar360.com',
          clave: hashedPassword,
          rol: UserRole.COMPRADOR
        }
      ];
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
  }

  createVendedor(userData: CreateUserRequest, isAdmin: boolean = false): Observable<User> {
    // Validar rol de administrador
    if (!isAdmin) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('Solo los administradores pueden crear usuarios vendedores'));
        }, 1000);
      });
    }

    // Validar email único
    const emailExists = this.users.some(user => user.correo.toLowerCase() === userData.correo.toLowerCase());
    if (emailExists) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('El correo electrónico ya está registrado'));
        }, 1000);
      });
    }

    // Validar documento único
    const documentExists = this.users.some(user => user.documento === userData.documento);
    if (documentExists) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('El documento de identidad ya está registrado'));
        }, 1000);
      });
    }

    // Validar mayor de edad
    const birthDate = new Date(userData.fechaNacimiento);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error(new Error('El usuario debe ser mayor de edad'));
        }, 1000);
      });
    }

    const newUser: User = {
      id: Date.now().toString(),
      nombre: userData.nombre,
      apellido: userData.apellido,
      documento: userData.documento,
      celular: userData.celular,
      fechaNacimiento: userData.fechaNacimiento,
      correo: userData.correo,
      clave: this.cryptoService.hashPassword(userData.clave),
      rol: UserRole.VENDEDOR
    };

    this.users.push(newUser);
    this.saveToStorage();

    return of(newUser).pipe(delay(1000));
  }

  getVendedores(): Observable<User[]> {
    const vendedores = this.users.filter(user => user.rol === UserRole.VENDEDOR);
    return of(vendedores).pipe(delay(500));
  }

  // Método para debugging - verificar contraseñas cifradas
  debugUsers(): void {
    console.log('Usuarios en localStorage:', this.users.map(u => ({
      correo: u.correo,
      clave: u.clave,
      claveLength: u.clave?.length,
      isBcryptHash: u.clave?.startsWith('$2') || false
    })));
  }


}
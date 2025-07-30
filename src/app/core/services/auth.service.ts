import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, UserRole, LoginRequest, AuthResponse } from '../../shared/models';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();
  public isAuthenticated = computed(() => this.currentUserSignal() !== null);
  public isAdmin = computed(() => this.currentUserSignal()?.rol === UserRole.ADMIN);
  public isVendedor = computed(() => this.currentUserSignal()?.rol === UserRole.VENDEDOR);

  // Mock users for testing
  private mockUsers: User[] = [
    {
      id: '1',
      nombre: 'Admin',
      apellido: 'Sistema',
      documento: '12345678',
      celular: '+573001234567',
      fechaNacimiento: '1990-01-01',
      correo: 'admin@hogar360.com',
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
      rol: UserRole.COMPRADOR
    }
  ];

  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    const user = this.mockUsers.find(u => u.correo === credentials.correo);
    
    if (!user || credentials.clave !== 'password123') {
      return throwError(() => new Error('Credenciales inválidas')).pipe(delay(1000));
    }

    const authResponse: AuthResponse = {
      user,
      token: `mock-token-${user.id}-${Date.now()}`
    };

    return of(authResponse).pipe(
      delay(1000),
      map(response => {
        this.setCurrentUser(response.user);
        this.saveToStorage(response);
        return response;
      })
    );
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER);
  }

  private setCurrentUser(user: User): void {
    this.currentUserSignal.set(user);
  }

  private saveToStorage(authResponse: AuthResponse): void {
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN, authResponse.token);
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.USER, JSON.stringify(authResponse.user));
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.USER);
    const token = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
    
    if (userJson && token) {
      try {
        const user = JSON.parse(userJson) as User;
        this.setCurrentUser(user);
      } catch {
        this.logout();
      }
    }
  }
}
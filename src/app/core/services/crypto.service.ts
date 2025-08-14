import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly saltRounds = 10;

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.saltRounds);
  }

  comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
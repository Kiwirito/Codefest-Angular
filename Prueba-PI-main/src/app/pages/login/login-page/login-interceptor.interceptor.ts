// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'dev-o4zy2niy85cpac84.us.auth0.com'; // Reemplaza con la URL de tu servidor de autenticación

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, { username, password });
  }

  // Implementa más métodos según tus necesidades, como cerrar sesión y verificar el estado de autenticación.
}

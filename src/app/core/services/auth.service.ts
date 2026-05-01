import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'auth_token';
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient
  ) { }

  login(email: string, password: string) {
    return this.http.get<User[]>(this.baseUrl).pipe(
      map((users) => {
        console.log('All Users:', users);

        const matchedUser = users.find(
          user =>
            user.email === email &&
            user.password === password
        );

        if (matchedUser) {
          const token = 'fake-jwt-token';

          localStorage.setItem(
            this.tokenKey,
            token
          );

          return true;
        }

        return false;
      })
    );
  }

  checkEmailExists(email: string) {
    return this.http.get<User[]>(this.baseUrl).pipe(
      map((users) => {
        return users.some(
          user => user.email === email
        )
      })
    )
  }

  signup(userData: { id: number; email: string; password: string }) {
    return this.http.post(this.baseUrl, userData);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
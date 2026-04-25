import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'auth_token';

  constructor() { }


  login(email: string, password: string): boolean {
    if (
      email === 'saif@gmail.com' && password === 'saif123'
    ) {
      const token = 'fake-jwt-token';

      localStorage.setItem(this.tokenKey, token);
      return true;
    }
    return false;
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD2LuhpYrAoJspCizXQmIwL02aVyEBuF0k'

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    this.http.post<AuthResponseData>(
      this.url,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    );
  }
}

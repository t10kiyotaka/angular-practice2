import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  apiKey = 'AIzaSyD2LuhpYrAoJspCizXQmIwL02aVyEBuF0k';

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
    return this.http.post<AuthResponseData>(
      url,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(
      catchError(errorRes => {
        let errorMessage = 'An unknown error occurred!';
        console.log(errorRes.error.error);
        console.log(errorRes.error);
        if (!errorRes.error || !errorRes.error.error) {
          return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already.';
        }
        return throwError(errorMessage);
      })
    );
  }

  login(email: string, password: string) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;
    return this.http.post<AuthResponseData>(
      url,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
  }
}

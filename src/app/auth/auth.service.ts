import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';

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
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient,
              private router: Router) {}

  signUp(email: string, password: string): Observable<AuthResponseData> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
    return this.auth(email, password, url)
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;
    return this.auth(email, password, url)
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  private auth(email: string, password: string, url: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      url,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(
      catchError(this.handleError),
      tap(resDate => this.buildUser(resDate))
    )
  }

  private buildUser(resData: AuthResponseData) {
    const expiresDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    const user = new User(resData.email, resData.localId, resData.idToken, expiresDate);
    this.user.next(user)
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    console.log(errorRes.error.error);
    console.log(errorRes.error);
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    errorMessage = AuthService.makeErrorMessage(errorRes.error.error.message) || errorMessage;
    return throwError(errorMessage);
  }

  private static makeErrorMessage(errorMessage: string) {
    let returnMessage;
    switch (errorMessage) {
      case 'EMAIL_EXISTS':
        returnMessage = 'This email exists already.';
        break;
      case 'INVALID_PASSWORD':
        returnMessage = 'The password is invalid.';
        break;
      case 'EMAIL_NOT_FOUND':
        returnMessage = 'The email is not found.';
    }
    return returnMessage;
  }
}

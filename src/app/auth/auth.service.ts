import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, UserJson } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

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
  apiKey = environment.firebaseAPIKey;
  user = new BehaviorSubject<User>(null);
  tokenExpirationTimer: any;

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
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  autoLogin() {
    const userData: UserJson  = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;

    const loadedUser = User.fromJson(userData);
    if (loadedUser.token) this.handleAuthentication(loadedUser);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration)
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
      tap(resData => this.handleAuthentication(this.buildUser(resData)))
    )
  }

  private handleAuthentication(user: User) {
    this.user.next(user);
    const expirationDuration = user._tokenExpirationDate.getTime() - new Date().getTime();
    this.autoLogout(expirationDuration);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private buildUser(resData: AuthResponseData): User {
    const expiresDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    return new User(resData.email, resData.localId, resData.idToken, expiresDate);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
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

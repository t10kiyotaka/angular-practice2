import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.action';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthResponseData } from '../auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginFail } from './auth.action';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  apiKey = environment.firebaseAPIKey;

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;
      return this.http.post<AuthResponseData>(
        url,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      )
      .pipe(
        map(resData => {
          const expiresDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          return new AuthActions.Login({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate: expiresDate
          })
        }),
        catchError(errorRes => this.handleError(errorRes))
      )
    })
  );

  @Effect()
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => {
      this.router.navigate(['/']);
    })
  );


  constructor(private actions$: Actions,
              private http: HttpClient,
              private router: Router) {}


  private handleError(errorRes: HttpErrorResponse): Observable<LoginFail> {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return of(new AuthActions.LoginFail(errorMessage));
    }
    errorMessage = AuthEffects.makeErrorMessage(errorRes.error.error.message) || errorMessage;
    return of(new AuthActions.LoginFail(errorMessage));
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

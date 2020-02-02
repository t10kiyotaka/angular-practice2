import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.action';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthResponseData } from '../auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateFail } from './auth.action';

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
  authSignUp = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signUpAction: AuthActions.SignUpStart) => {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
      return this.handleAuth(
        signUpAction.payload.email,
        signUpAction.payload.password,
        url
      )
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;
      return this.handleAuth(
        authData.payload.email,
        authData.payload.password,
        url
      )
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}

  private handleError(errorRes: HttpErrorResponse): AuthenticateFail {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return new AuthActions.AuthenticateFail(errorMessage);
    }
    errorMessage = AuthEffects.makeErrorMessage(errorRes.error.error.message, errorMessage);
    return new AuthActions.AuthenticateFail(errorMessage);
  }

  private static makeErrorMessage(errorMessage: string, defaultMessage: string): string {
    let returnMessage = defaultMessage;
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

  private handleAuth(email: string, password: string, url: string) {
    return this.http.post<AuthResponseData>(
      url,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
      .pipe(
        map((resData: AuthResponseData) => {
          return this.handleAuthSuccess(resData);
        }),
        catchError(errorRes => {
          return of(this.handleError(errorRes));
        })
      )
  }

  private handleAuthSuccess = (resData: AuthResponseData) => {
    const expiresDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    return new AuthActions.AuthenticateSuccess({
      email: resData.email,
      userId: resData.localId,
      token: resData.idToken,
      expirationDate: expiresDate
    });
  };
}

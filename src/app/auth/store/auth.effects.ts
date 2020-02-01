import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthResponseData } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

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
        map((resData: AuthResponseData) => {
          const expiresDate = new Date(new Date().getTime() + +resData.ex * 1000);
          return of(new AuthActions.Login({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate: expiresDate
          }));
        }),
        catchError(error => {
          //...
          of();
        })
      );
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}
}

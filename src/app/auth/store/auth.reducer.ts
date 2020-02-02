import { User } from '../user.model';
import * as AuthActions from './auth.action';

export interface State {
  user: User;
  authError: string;
  isLoading: boolean;
}

const initialState = {
  user: null,
  authError: null,
  isLoading: false
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate,
      );
      return {
        ...state,
        user: user,
        authError: null,
        isLoading: false
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START :
      return {
        ...state,
        authError: null,
        isLoading: true
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        isLoading: false
      };
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null
      };
    default:
      return state;
  }
}

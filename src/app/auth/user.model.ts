
export interface UserJson {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
}

export class User {

  constructor(
    public email: string,
    public id: string,
    public _token: string,
    public _tokenExpirationDate: Date,
  ) {}

  get token() {
    if (!this._tokenExpirationDate || this._tokenExpirationDate < new Date()) {
      return null;
    }
    return this._token;
  }

  static fromJson(json: UserJson): User {
    return new User(json.email, json.id, json._token, new Date(json._tokenExpirationDate));
  }
}

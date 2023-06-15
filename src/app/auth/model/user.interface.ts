import { Role } from './roles.type';

export interface User {
  userid: string;
  username: string;
  exp: number;
  role: Role;
}

export interface UserWithToken extends User {
  token: string;
}

export interface IAccessToken {
  accessToken: string;
}


export enum Roles {
  HOST = 'host',
  PARTICIPANT = 'participant',
}

export interface User {
  name: string;
  role: Roles;
}
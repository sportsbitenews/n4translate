export interface User {

  $loki: number;
  email: string;
  admin: boolean;
  projects?: number[];
}

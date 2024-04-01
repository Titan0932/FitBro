export interface User {
  id: string;
  fname?: string;
  lname?: string;
  avatar?: string;
  email?: string;
  userDOB?: Date;
  [key: string]: unknown;
}

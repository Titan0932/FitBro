export interface User {
  id: string;
  fname?: string;
  lname?: string;
  avatar?: string;
  email?: string;
  userDOB?: Date;
  phoneNo?: string;
  city?: string;
  state?: string;
  country?: string;
  [key: string]: unknown;
}

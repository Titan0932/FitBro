export interface User {
  id: string;
  f_name?: string;
  l_name?: string;
  avatar?: string;
  email?: string;
  user_dob?: string;
  phoneno?: string;
  city?: string;
  state?: string;
  country?: string;
  [key: string]: unknown;
}

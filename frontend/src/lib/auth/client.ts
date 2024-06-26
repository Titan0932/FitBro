'use client';

import { UserContextValue } from '@/contexts/user-context';
import type { User } from '@/types/user';

const axios = require('axios');

// function generateToken(): string {
//   const arr = new Uint8Array(12);
//   window.crypto.getRandomValues(arr);
//   return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
// }

// const user = {
//   id: '',
//   avatar: '/assets/avatar.png',
//   firstName: '',
//   lastName: '',
//   email: '',
//   dob: '',
//   phoneno: '',
//   city: '',
//   state: '',
//   country: '',
// } satisfies User;


export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string;
  role?: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    // Make API request
    const { firstName, lastName, email, password, dob, role } = params;
    let data = `email=${email}&user_passw=${password}&f_name=${firstName}&l_name=${lastName}&user_dob=${dob}&role=${role}`

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3005/users/register',
      data: data,
    };

    return await axios.request(config)
      .then((response:any) => {
        console.log(JSON.stringify(response.data));
        return {};
      })
      .catch((error:any) => {
        console.log("Error: ", error);
        return {error: error?.response?.data ?? error.message}
      });

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams, loginUser: UserContextValue | undefined): Promise<{ error?: string }> {
    const { email, password } = params;
    // Make API request
    let data = `email=${email}&user_passw=${password}&role=${loginUser?.role}`

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3005/users/login',
      data: data,
    };

    return await axios.request(config)
      .then((response:any) => {
        console.log(JSON.stringify(response.data));
        localStorage.setItem('custom-auth-token', response.data.jwtToken);
        return {};
      })
      .catch((error:any) => {
        console.log("Error: ", error);
        return {error: error?.response?.data ?? error.message}
      });
    // We do not handle the API, so we'll check if the credentials match with the hardcoded ones.
    // if (email !== 'sofia@devias.io' || password !== 'Secret1') {
    //   return { error: 'Invalid credentials' };
    // }
    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request
    const token = localStorage.getItem('custom-auth-token')
    if(token == null) return {data: null}
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:3005/users/getUserInfo',
      data: '',
      headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
    };

    return await axios.request(config)
      .then((response:any) => {
        console.log("User data: ", JSON.stringify(response.data));
        return {data: response.data};
      })
      .catch((error:any) => {
        console.log("Error: ", error);
        return {data: null}
      });
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();

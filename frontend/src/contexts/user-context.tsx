'use client';

import * as React from 'react';

import type { User } from '@/types/user';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { redirect, useRouter } from 'next/navigation';
import { setCookie, parseCookies } from 'nookies';
import axios from 'axios';
import { resolve } from 'path';


export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
  role?: string;
  updateRole?: (role: string, checkRole?: boolean) => Promise<void>;
  setState?: React.Dispatch<React.SetStateAction<UserContextValue>>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const router = useRouter();
  const cookies = parseCookies();
  const [state, setState] = React.useState<UserContextValue>({
    user: null,
    error: null,
    isLoading: true,
    role: cookies.role ?? 'Member',
    updateRole: () => {return new Promise<void>((resolve) => {resolve()})},
    setState: () => {throw new Error('setState function must be overridden');},
  });

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const { data, error } = await authClient.getUser();
      if (error) {
        logger.error(error);
        setState((prev) => ({ ...prev, user: null, error: 'Something went wrong', isLoading: false }));
        return;
      }

      setState((prev) => ({ ...prev, user: data ?? null, error: null, isLoading: false }));
    } catch (err: unknown) {
      logger.error(err);
      setState((prev) => ({ ...prev, user: null, error: 'Something went wrong', isLoading: false }));
    }
  }, []);

  React.useEffect(() => {
    checkSession().catch((err: unknown) => {
      logger.error(err);
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, []);

  const updateRole = async (role: string, checkRole: boolean = false) => {
    // call API and verify role before setting role
    const token = localStorage.getItem('custom-auth-token')
    if(token == null){
       // TODO: if no token, redirect to login page
       router.refresh();
    }

    if(checkRole && (state?.role)?.toLowerCase() != (role).toLowerCase()){
      let data = `role=${role}`
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:3005/users/checkUserEmailRoleExists',
        data: data,
        headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
      };

      return await axios.request(config)
        .then(async (response:any) => {
           if(response){
            const switchConfig = {
              method: 'post',
              maxBodyLength: Infinity,
              url: 'http://localhost:3005/users/switchRoles',
              data: `newRole=${role}`,
              headers: {"Authorization": "Bearer " + localStorage.getItem('custom-auth-token')}
            }
            await axios.request(switchConfig).then(
              (switchResponse:any) => {
                localStorage.setItem('custom-auth-token', switchResponse.data);
                setCookie(null, 'role', role, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: '/',
                });
                setState((prev) => ({ ...prev, role }));
              }
            ).catch((switchErr) => {
              console.log("Error: ", switchErr);
              alert(switchErr?.response?.data ?? switchErr.message)
              return new Promise<void>((resolve) => {resolve()});
            })
          }
        })
        .catch((error:any) => {
          console.log("Error: ", error);
          alert(error?.response?.data ?? error.message)
        });
    }else{
      setCookie(null, 'role', role, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      setState((prev) => ({ ...prev, role }));
      return new Promise<void>((resolve) => {resolve()});
    }
  }

  return <UserContext.Provider value={{ ...state, checkSession, setState, updateRole }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;

'use client';

import {
  Configuration,
  ConfigurationParameters,
  HTTPHeaders,
  Middleware,
  RequestContext,
  ResponseContext,
  AuthenticationApi,
  CustomersApi,
  UsersApi,
  EventApi,
  PlacesApi,
} from '@xcd/sdk';
// import { useRouter } from 'next/navigation';
import { createContext, useEffect, useMemo, useState } from 'react';

export type ApiContextType = {
  event: EventApi;
  places: PlacesApi;
  users: UsersApi;
  customers: CustomersApi;
  authentication: AuthenticationApi;
};

export const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({
  children,
  headers,
}: {
  children: React.ReactNode;
  headers: HTTPHeaders;
}) => {
  // global error handler ---------------------------------------------------------
  const [error, setError] = useState<Error | null>(null);
  // const router = useRouter();

  useEffect(() => {
    // TODO: add handler for error if required
    if (error?.message) {
      console.error(error);
    }
    return () => {
      setError(null);
    };
  }, [error]);

  const baseConfigurationParams: ConfigurationParameters = useMemo(
    () => ({
      headers: { ...headers },
      basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
      fetchApi: fetch,
      credentials: 'include',
    }),
    [headers],
  );

  // generate a configuration with the base path and custom fetch ------------------
  const configuration = useMemo(
    () =>
      new Configuration({
        ...baseConfigurationParams,
      }),
    [baseConfigurationParams],
  );

  // middleware ------------------------------------------------------------------
  const middleware: Middleware[] = useMemo(
    () => [
      {
        post: async (context: ResponseContext) => {
          if (context.response?.status === 401) {
            if (context.url.includes('/auth/refresh-jwt-token')) {
              throw new Error('Refresh token expired');
            }
            console.warn('401 Unauthorized - Auth refresh not implemented');
          }
        },
        pre: async (context: RequestContext) => {
          if (context.url.includes('/auth/reset-password')) {
            context.init.headers = {
              ...context.init.headers,
              'Content-Type': 'application/json',
            };
          }
          return context;
        },
      },
    ],
    [configuration],
  );

  const configurationWithMiddleware = useMemo(() => {
    const config = new Configuration({
      ...baseConfigurationParams,
      middleware,
    });
    return config;
  }, [baseConfigurationParams, middleware]);

  // generate the api instances with the custom fetch function -------------------
  const useApiInstance = (api: any) => {
    return useMemo(() => new api(configurationWithMiddleware), []);
  };

  // add new api instances here --------------------------------------------------
  const event = useApiInstance(EventApi);
  const places = useApiInstance(PlacesApi);
  const users = useApiInstance(UsersApi);
  const customers = useApiInstance(CustomersApi);
  const authentication = useApiInstance(AuthenticationApi);
  // return the api context provider with the api instances ---------------------
  return (
    <ApiContext.Provider
      value={{
        event,
        places,
        users,
        customers,
        authentication,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

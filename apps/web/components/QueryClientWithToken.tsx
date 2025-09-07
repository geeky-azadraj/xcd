'use client';

import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useMemo, useState } from 'react';
import { ApiProvider } from '@/context/ApiContext';
import { useSession } from '@/context/SessionContext';
import { logError } from '@/lib/utils/logError';

interface QueryClientWithTokenProps {
  children: React.ReactNode;
  // appId: 'user' | 'admin';
}

export default function QueryClientWithToken({
  children,
  // appId,
}: QueryClientWithTokenProps) {
  const queryClientOptions: QueryClientConfig = useMemo(
    () => ({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: 1000 * 60 * 5, // 5 minutes
          retry: false,
        },
        mutations: {
          onError: (error: Error) => {
            logError(error);
          },
        },
      },
    }),
    [],
  );
  const ReactQueryClient = useMemo(
    () => new QueryClient(queryClientOptions),
    [queryClientOptions],
  );

  // const { session } = useSession();
  // const [clientIp, setClientIp] = useState<string>('');

  // const deviceId = useMemo(() => {
  //   if (typeof window === 'undefined') return null;
  //   let deviceId = localStorage.getItem('device_id');
  //   if (!deviceId) {
  //     deviceId = crypto.randomUUID();
  //     localStorage.setItem('device_id', deviceId);
  //   }
  //   return deviceId;
  // }, []);

  useEffect(() => {
    // Fetch client IP from public IP service
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data: unknown) => {
        const ipData = data as { ip?: string };
        if (ipData?.ip) {
          console.log('Client IP is:', ipData.ip);
          // setClientIp(ipData.ip);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch client IP:', err);
      });
  }, []);

  return (
    <QueryClientProvider
      client={
        ReactQueryClient
      }
    >
      <ApiProvider
        headers={{
          // 'x-landing-app-id': appId,
          // 'x-device-id': deviceId || '',
          // 'x-client-ip': clientIp || '',
          // ...(session?.accessToken && {
          //   Authorization: `Bearer ${session.accessToken}`,
          // }),
        }}
      >
        {children}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </ApiProvider>
    </QueryClientProvider>
  );
}

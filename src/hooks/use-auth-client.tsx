import { client } from '@/lib/api/client.gen';
import { useSession } from 'next-auth/react';

export function useAuthClient() {
  const { data: session } = useSession();

  if (session?.user?.accessToken) {
    client.instance.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${session?.user?.accessToken}`;
      return config;
    });
  }

  return client;
}

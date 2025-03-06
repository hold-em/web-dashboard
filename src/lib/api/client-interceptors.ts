import { getSession } from 'next-auth/react';
import { client } from './client.gen';

client.instance.interceptors.request.use(async (config) => {
  // Skip interceptor for login endpoint
  if (
    config.url === '/auth/login' ||
    config.url === '/auth/logout' ||
    config.url === '/users/me'
  ) {
    return config;
  }

  const session = await getSession();
  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  return config;
});

export default client;

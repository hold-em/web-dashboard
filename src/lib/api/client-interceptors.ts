import { getSession } from 'next-auth/react';
import { client } from './client.gen';

client.instance.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  return config;
});

export default client;

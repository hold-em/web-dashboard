'use client';
import { useSession, signOut } from 'next-auth/react';
import React, { useEffect } from 'react';
import { client } from '@/lib/api/client.gen';
import { useRouter } from 'next/navigation';

export default function AuthHandler({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Request interceptor to add the token to all requests
    const requestInterceptor = client.instance.interceptors.request.use(
      (config) => {
        if (session?.user?.accessToken) {
          config.headers.Authorization = `Bearer ${session?.user?.accessToken}`;
        }
        return config;
      }
    );

    // Response interceptor to handle token expiration
    const responseInterceptor = client.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        // Check if the error is due to an expired token
        if (
          error.response?.status === 401 ||
          (error.response?.status === 400 &&
            error.response?.data?.message?.includes('Jwt expired'))
        ) {
          // If token is expired, simply log out the user
          if (session?.user) {
            setTimeout(() => {
              signOut();
              router.push('/');
            }, 500);
          }
        }

        return Promise.reject(error);
      }
    );

    // Clean up interceptors when component unmounts
    return () => {
      client.instance.interceptors.request.eject(requestInterceptor);
      client.instance.interceptors.response.eject(responseInterceptor);
    };
  }, [session, router]);

  if (!session) {
    return <>{children}</>;
  }

  return <>{children}</>;
}

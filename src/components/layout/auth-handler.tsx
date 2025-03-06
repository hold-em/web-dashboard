'use client';
import { useSession, signOut } from 'next-auth/react';
import React, { useEffect } from 'react';
import { client } from '@/lib/api/client.gen';
import { refreshToken } from '@/lib/api/sdk.gen';
import { useRouter } from 'next/navigation';
export default function AuthHandler({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, update } = useSession();

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
        const originalRequest = error.config;

        // Check if the error is due to an expired token
        if (
          error.response?.status === 401 ||
          (error.response?.status === 400 &&
            error.response?.data?.message?.includes('Jwt expired'))
        ) {
          if (!originalRequest._retry && session?.user?.refreshToken) {
            originalRequest._retry = true;
            try {
              const { data: refreshData } = await refreshToken({
                body: {
                  refresh_token: session.user.refreshToken
                }
              });

              if (refreshData?.data?.access_token) {
                await update({
                  ...session,
                  user: {
                    ...session.user,
                    accessToken: refreshData.data.access_token,
                    refreshToken:
                      refreshData.data.refresh_token ||
                      session.user.refreshToken
                  }
                });

                originalRequest.headers.Authorization = `Bearer ${refreshData.data.access_token}`;
                return client.instance(originalRequest);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);

              // 🔹 이미 로그아웃 진행 중이면 signOut() 호출 방지
              if (!session?.user) return;

              // refreshToken 실패했을 때, signOut() 호출 전에 추가 딜레이를 주기
              setTimeout(() => {
                signOut();
                router.push('/');
              }, 500); // 0.5초 딜레이 후 로그아웃
            }
          } else if (!session?.user?.refreshToken) {
            if (!session?.user) return; // 이미 세션 삭제된 경우 방지

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
  }, [session, update]);

  if (!session) {
    return <>{children}</>;
  }

  return <>{children}</>;
}

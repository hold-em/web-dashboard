import { getSession } from 'next-auth/react';
import { client } from './client.gen';
import { refreshToken } from './sdk.gen';

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

// ✅ 응답 인터셉터: 401 에러 발생 시 자동으로 `refreshToken` 호출
client.instance.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized 발생 시 Refresh Token 사용
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지

      try {
        const session = await getSession();
        if (!session?.user?.refreshToken) {
          throw new Error('No refresh token available');
        }

        // ✅ `refreshToken` API 호출
        const refreshResponse = await refreshToken({
          client, // hey-api의 클라이언트 사용
          body: {
            refresh_token: session.user.refreshToken
          }
        });

        if (!refreshResponse || !refreshResponse.data?.data?.access_token) {
          throw new Error('Failed to refresh token');
        }

        const newAccessToken = refreshResponse.data.data.access_token;

        // ✅ 새로운 Access Token을 Axios 요청에 적용
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // ✅ 기존 요청 다시 실행
        return client.instance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default client;

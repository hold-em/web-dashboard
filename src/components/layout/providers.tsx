'use client';
import React, { useEffect } from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { SessionProvider } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setTheme('light');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

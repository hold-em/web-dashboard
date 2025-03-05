import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from './user-auth-form';
import Image from 'next/image';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'YAJASU Admin Login',
  description: 'Login to YAJASU admin dashboard.'
};

export default function SignInViewPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/signup'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Sign up
      </Link>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
        <div className='absolute inset-0 bg-zinc-900' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <Image
            src='/images/yajasu-logo.png'
            alt='YAJASU'
            width={83}
            height={56}
          />
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'></blockquote>
        </div>
      </div>
      <div className='flex h-full items-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              야자수 관리자 로그인
            </h1>
            <p className='text-sm text-muted-foreground'>
              관리자 계정으로 로그인하세요
            </p>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <UserAuthForm />
          </Suspense>
          {/* <p className='px-8 text-center text-sm text-muted-foreground'>
            Don&apos;t have an admin account?{' '}
            <Link
              href='/signup'
              className='underline underline-offset-4 hover:text-primary'
            >
              Sign up
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
}

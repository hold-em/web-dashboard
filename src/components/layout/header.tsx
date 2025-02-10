import React from 'react';
import { UserNav } from './user-nav';
import Image from 'next/image';
import PageTitle from '../page-title';
import NotificationButton from '../notification-button';
import StoreSelect from './store-select';

export default function Header() {
  return (
    <header className='flex items-center gap-8 px-6 py-2'>
      <Image
        src='/images/yajasu-logo.svg'
        alt='YAJASU'
        width={83}
        height={56}
        priority
      />
      <PageTitle />
      <div className='ml-auto flex items-center gap-2.5'>
        <StoreSelect />
        <NotificationButton />
        <UserNav />
      </div>
    </header>
  );
}

import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { UserNav } from './user-nav';
import PageTitle from '../page-title';
import NotificationButton from '../notification-button';
import StoreSelect from './store-select';
import { Separator } from '../ui/separator';

export default function Header() {
  return (
    <header className='flex items-center gap-8 border-b border-b-gray-200 bg-white px-4 py-2'>
      <div className='flex items-center gap-2'>
        <SidebarTrigger />
        <Separator orientation='vertical' className='h-4' />
        <PageTitle />
      </div>
      <div className='ml-auto flex items-center gap-2'>
        <StoreSelect />
        <NotificationButton />
        <UserNav />
      </div>
    </header>
  );
}

import React from 'react';

export default function PageContainer({
  children
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return <div className='flex-1 overflow-y-auto px-4 py-8'>{children}</div>;
}

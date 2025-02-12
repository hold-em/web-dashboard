'use client';
import { usePathname } from 'next/navigation';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';

const getActiveTitle = (pathname: string): string | undefined => {
  for (const item of navItems) {
    if (item.url === pathname) return item.title;

    if (item.items?.length) {
      const foundSubItem = item.items.find(
        (subItem) => subItem.url === pathname
      );
      if (foundSubItem) return foundSubItem.title;
    }
  }
  return undefined;
};

export default function PageTitle() {
  const pathname = usePathname();
  const title = getActiveTitle(pathname);

  if (!title) return null;
  return (
    <h2 className={cn('text-lg font-bold tracking-tight')}>
      {getActiveTitle(pathname)}
    </h2>
  );
}

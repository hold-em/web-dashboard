import { Button } from './ui/button';
import { Icons } from './icons';
import { cn } from '@/lib/utils';

export default function NotificationButton() {
  return (
    <Button
      variant='ghost'
      size='icon'
      className={cn('flex-none rounded-full')}
    >
      <Icons.bell />
    </Button>
  );
}

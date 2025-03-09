'use client';
import { User } from '@/mocks/users';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

export default function SortableUser({
  user,
  containerId
}: {
  user: User;
  containerId: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: user.id, data: { type: 'user', user, containerId } });
  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    transition
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      suppressHydrationWarning
      {...listeners}
      {...attributes}
      className='cursor-move rounded border bg-white p-2'
    >
      {user.name + '(' + user.phone.slice(9) + ')'}
    </div>
  );
}

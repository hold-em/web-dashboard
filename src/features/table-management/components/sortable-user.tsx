'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { User } from '@/mocks/users';
import { TestUser } from '@/lib/api';

type SortableUserProps = {
  user: User | TestUser;
  containerId: string;
};

export default function SortableUser({ user, containerId }: SortableUserProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: user.id,
    data: { containerId, type: 'user', user }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab rounded-sm border border-gray-200 bg-white p-2 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className='flex items-center gap-2'>
        <div className='flex-1'>
          <div className='font-medium'>{user.name}</div>
          {'nickname' in user && user.nickname && (
            <div className='text-sm text-gray-500'>{user.nickname}</div>
          )}
        </div>
      </div>
    </div>
  );
}

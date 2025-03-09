'use client';
import { User } from '@/mocks/users';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import SortableUser from './sortable-user';

export default function UserList({ users }: { users: User[] }) {
  return (
    <div className='grid h-full grid-cols-2 gap-2' id='user-list'>
      <SortableContext
        items={users.map((u) => u.id)}
        strategy={verticalListSortingStrategy}
      >
        {users.map((user) => (
          <SortableUser key={user.id} user={user} containerId='user-list' />
        ))}
      </SortableContext>
    </div>
  );
}

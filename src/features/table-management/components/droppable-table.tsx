'use client';
import { useDroppable } from '@dnd-kit/core';
import { GameTable } from '@/mocks/tables';
import { Icons } from '@/components/icons';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import SortableUser from './sortable-user';
import { User } from '@/mocks/users';

export default function DroppableTable({
  table,
  users
}: {
  table: GameTable;
  users: User[];
}) {
  const { setNodeRef } = useDroppable({
    id: table.id,
    data: { containerId: table.id, type: 'table', table }
  });
  const capacity = 6;
  const count = table.player_ids.length;
  let bgColor = '';
  if (count === 0) {
    bgColor = 'bg-gray-200';
  } else if (count < capacity / 2) {
    bgColor = 'bg-green-200';
  } else if (count < capacity) {
    bgColor = 'bg-yellow-200';
  } else {
    bgColor = 'bg-red-200';
  }
  return (
    <li
      ref={setNodeRef}
      id={table.id}
      className={`min-h-[200px] rounded-sm border border-gray-200 p-4 ${bgColor} ${count >= capacity ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className='h-full w-full'>
        <div className='font-bold'>{table.name}</div>
        <div className='mt-2 flex items-center gap-1'>
          <Icons.users size={16} />
          <div>
            {count} / {capacity}
          </div>
        </div>
        <div className='mt-2 space-y-1'>
          <SortableContext
            items={table.player_ids}
            strategy={verticalListSortingStrategy}
          >
            {table.player_ids.length === 0 ? (
              <div className='min-h-[40px] w-full' />
            ) : (
              table.player_ids.map((userId) => {
                const user = users.find((u) => u.id === userId);
                return user ? (
                  <SortableUser
                    key={user.id}
                    user={user}
                    containerId={table.id}
                  />
                ) : null;
              })
            )}
          </SortableContext>
        </div>
      </div>
    </li>
  );
}

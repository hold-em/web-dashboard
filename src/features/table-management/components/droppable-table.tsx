'use client';
import { useDroppable } from '@dnd-kit/core';
import { Icons } from '@/components/icons';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import SortableUser from './sortable-user';
import { User } from '@/mocks/users';
import { GameTableRestResponse } from '@/lib/api';

export default function DroppableTable({
  table,
  users,
  onDelete
}: {
  table: GameTableRestResponse;
  users: User[];
  onDelete: () => void;
}) {
  const { setNodeRef } = useDroppable({
    id: table.id,
    data: { containerId: table.id, type: 'table', table }
  });
  const capacity = table.max_players;
  const count = table.participants?.length ?? 0;

  return (
    <li
      ref={setNodeRef}
      id={table.id}
      className={`min-h-[200px] rounded-sm border border-gray-200 p-4 ${count >= capacity ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className='h-full w-full'>
        <div className='flex items-center justify-between'>
          <div className='font-bold'>{table.name}</div>
          <button
            onClick={onDelete}
            className='rounded-sm p-1 text-gray-500 hover:bg-gray-300 hover:text-gray-700'
          >
            <Icons.trash size={16} />
          </button>
        </div>
        <div className='mt-2 flex items-center gap-1'>
          <Icons.users size={16} />
          <div>
            {count} / {capacity}
          </div>
        </div>
        <div className='mt-2 space-y-1'>
          <SortableContext
            items={table.participants?.map((p) => p.id) ?? []}
            strategy={verticalListSortingStrategy}
          >
            {!table.participants || table.participants.length === 0 ? (
              <div className='min-h-[40px] w-full' />
            ) : (
              table.participants.map((participant) => (
                <SortableUser
                  key={participant.id}
                  user={participant}
                  containerId={table.id}
                />
              ))
            )}
          </SortableContext>
        </div>
      </div>
    </li>
  );
}

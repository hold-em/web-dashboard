'use client';
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import PageContainer from '@/components/layout/page-container';
import { Game, mockGames } from '@/mocks/games';
import { GameTable, mockTables } from '@/mocks/tables';
import { User, mockUsers } from '@/mocks/users';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import { Section, SectionContent, SectionTitle } from '@/components/section';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuid } from 'uuid';
import SortableUser from './sortable-user';
import UserList from './user-list';
import DroppableTable from './droppable-table';

function arraysEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default function TableManagementPage() {
  const [availableUsers, setAvailableUsers] = useState(
    mockUsers.filter(
      (user) => !mockTables.some((table) => table.player_ids.includes(user.id))
    )
  );
  const [tables, setTables] = useState<GameTable[]>(mockTables);
  const [activeUser, setActiveUser] = useState<null | User>(null);
  const [newTableName, setNewTableName] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | undefined>(undefined);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const lastDragOverUpdateRef = useRef(0);
  const CAPACITY = 11;

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const user = mockUsers.find((u) => u.id === active.id);
    if (user) setActiveUser(user);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id.toString();
    const overId = over.id.toString();
    const sourceContainer = active.data.current?.containerId as string;
    const destinationContainer =
      (over.data.current?.containerId as string) || overId;
    let throttleDelay = 50;
    if (destinationContainer !== 'user-list') {
      const destTable = tables.find(
        (table) => table.id === destinationContainer
      );
      if (destTable && destTable.player_ids.length === 0) {
        throttleDelay = 0;
      }
    }
    const now = Date.now();
    if (now - lastDragOverUpdateRef.current < throttleDelay) return;
    lastDragOverUpdateRef.current = now;
    if (sourceContainer === destinationContainer) {
      if (sourceContainer === 'user-list') {
        setAvailableUsers((prev) => {
          const sourceIndex = prev.findIndex((u) => u.id === activeId);
          const destIndex = prev.findIndex((u) => u.id === overId);
          if (
            sourceIndex === -1 ||
            destIndex === -1 ||
            sourceIndex === destIndex
          )
            return prev;
          const newOrder = arrayMove(prev, sourceIndex, destIndex);
          return arraysEqual(
            newOrder.map((u) => u.id),
            prev.map((u) => u.id)
          )
            ? prev
            : newOrder;
        });
      } else {
        setTables((prevTables) =>
          prevTables.map((table) => {
            if (table.id === sourceContainer) {
              const sourceIndex = table.player_ids.indexOf(activeId);
              const destIndex = table.player_ids.indexOf(overId);
              if (
                sourceIndex === -1 ||
                destIndex === -1 ||
                sourceIndex === destIndex
              )
                return table;
              const newIds = arrayMove(
                table.player_ids,
                sourceIndex,
                destIndex
              );
              return arraysEqual(newIds, table.player_ids)
                ? table
                : { ...table, player_ids: newIds };
            }
            return table;
          })
        );
      }
    } else {
      if (
        sourceContainer === 'user-list' &&
        destinationContainer !== 'user-list'
      ) {
        const destTable = tables.find(
          (table) => table.id === destinationContainer
        );
        if (destTable && destTable.player_ids.length >= CAPACITY) return;
        setAvailableUsers((prev) => prev.filter((u) => u.id !== activeId));
        setTables((prevTables) =>
          prevTables.map((table) => {
            if (table.id === destinationContainer) {
              const newIds = [...table.player_ids];
              const destIndex =
                over.data.current?.sortable?.index ?? newIds.length;
              if (!newIds.includes(activeId)) {
                newIds.splice(destIndex, 0, activeId);
                return { ...table, player_ids: newIds };
              }
            }
            return table;
          })
        );
      } else if (
        sourceContainer !== 'user-list' &&
        destinationContainer === 'user-list'
      ) {
        setTables((prevTables) =>
          prevTables.map((table) => {
            if (table.id === sourceContainer) {
              const newIds = table.player_ids.filter((id) => id !== activeId);
              return newIds.length === table.player_ids.length
                ? table
                : { ...table, player_ids: newIds };
            }
            return table;
          })
        );
        const movedUser = mockUsers.find((u) => u.id === activeId);
        if (movedUser) {
          setAvailableUsers((prev) => {
            if (prev.some((u) => u.id === activeId)) return prev;
            const destIndex = over.data.current?.sortable?.index ?? prev.length;
            const newList = [...prev];
            newList.splice(destIndex, 0, movedUser);
            return newList;
          });
        }
      } else if (
        sourceContainer !== 'user-list' &&
        destinationContainer !== 'user-list'
      ) {
        const destTable = tables.find(
          (table) => table.id === destinationContainer
        );
        if (destTable && destTable.player_ids.length >= CAPACITY) return;
        setTables((prevTables) => {
          let moved: string | null = null;
          const updated = prevTables.map((table) => {
            if (table.id === sourceContainer) {
              const newIds = table.player_ids.filter((id) => {
                if (id === activeId) {
                  moved = id;
                  return false;
                }
                return true;
              });
              return { ...table, player_ids: newIds };
            }
            return table;
          });
          return updated.map((table) => {
            if (table.id === destinationContainer && moved !== null) {
              const newIds = [...table.player_ids];
              const destIndex =
                over.data.current?.sortable?.index ?? newIds.length;
              if (!newIds.includes(activeId)) {
                newIds.splice(destIndex, 0, activeId);
                return { ...table, player_ids: newIds };
              }
            }
            return table;
          });
        });
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveUser(null);
  }

  function handleAddTable() {
    if (!newTableName.trim()) return;
    const newTable: GameTable = {
      id: uuid(),
      name: newTableName,
      player_ids: [],
      status: '대기 중',
      created_at: new Date().toISOString()
    };
    setTables((prev) => [...prev, newTable]);
    setNewTableName('');
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <PageContainer>
        <div className='mb-4 grid grid-cols-2 gap-2'>
          <Select
            value={selectedGame?.id}
            onValueChange={(gameId) => {
              setSelectedGame(mockGames.find((item) => item.id === gameId)!);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='게임 선택' />
            </SelectTrigger>
            <SelectContent>
              {mockGames.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='grid grid-cols-[300px_1fr] gap-4'>
          <Section className='flex h-[calc(100vh-12rem)] flex-col'>
            <SectionTitle>고객 리스트</SectionTitle>
            <SectionContent className='relative'>
              <UserList users={availableUsers} />
            </SectionContent>
          </Section>
          {selectedGame && (
            <Section>
              <SectionTitle>{selectedGame.name} - 테이블 현황</SectionTitle>
              <SectionContent>
                <div className='mb-4 flex items-center gap-2'>
                  <Input
                    type='text'
                    placeholder='새 테이블 이름'
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                  />
                  <Button
                    variant='secondary'
                    className='flex-none p-2'
                    onClick={handleAddTable}
                  >
                    <Icons.add />
                    테이블 추가
                  </Button>
                </div>
                <ul className='grid grid-cols-2 gap-2'>
                  {tables.map((table) => (
                    <DroppableTable
                      key={table.id}
                      table={table}
                      users={mockUsers}
                    />
                  ))}
                </ul>
              </SectionContent>
            </Section>
          )}
        </div>
      </PageContainer>
      {typeof document !== 'undefined' &&
        createPortal(
          <DragOverlay>
            {activeUser ? (
              <SortableUser user={activeUser} containerId='user-list' />
            ) : null}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}

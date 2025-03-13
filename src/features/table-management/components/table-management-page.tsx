'use client';
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import PageContainer from '@/components/layout/page-container';
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
import { useGames } from '@/hooks/use-games';
import { useGameTables } from '@/hooks/use-game-tables';
import { useGameTypes } from '@/hooks/use-game-types';
import type { GameTableRestResponse, TestUser } from '@/lib/api';

function arraysEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default function TableManagementPage() {
  const [availableUsers, setAvailableUsers] = useState<User[]>(mockUsers);
  const [selectedGameId, setSelectedGameId] = useState<string>();
  const [activeUser, setActiveUser] = useState<null | User | TestUser>(null);
  const [newTableName, setNewTableName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState<number>(6);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const lastDragOverUpdateRef = useRef(0);
  const CAPACITY = 11;

  const { games, selectedGame } = useGames(selectedGameId);
  const { gameTypes } = useGameTypes();
  const {
    tables = [],
    createGameTable,
    updateGameTable,
    changeParticipants,
    isChangingParticipants,
    deleteGameTable,
    isDeletingTable
  } = useGameTables(selectedGameId);

  const tableList = (
    Array.isArray(tables) ? tables : (tables?.data ?? [])
  ) as GameTableRestResponse[];

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const user = mockUsers.find((u) => u.id === active.id);
    if (user) setActiveUser(user);
  }

  function handleDragOver(event: DragOverEvent) {
    if (!selectedGameId) return;

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    const sourceContainer = active.data.current?.containerId as string;
    const destinationContainer =
      (over.data.current?.containerId as string) || overId;

    let throttleDelay = 50;
    if (destinationContainer !== 'user-list') {
      const destTable = tableList.find(
        (table) => table.id === destinationContainer
      );
      if (
        destTable &&
        (!destTable.participants || destTable.participants.length === 0)
      ) {
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
        const table = tableList.find((t) => t.id === sourceContainer);
        if (!table) return;

        const participantIds = table.participants?.map((p) => p.id) ?? [];
        const sourceIndex = participantIds.indexOf(activeId);
        const destIndex = participantIds.indexOf(overId);
        if (sourceIndex === -1 || destIndex === -1 || sourceIndex === destIndex)
          return;

        const newIds = arrayMove(participantIds, sourceIndex, destIndex);
        if (!arraysEqual(newIds, participantIds)) {
          changeParticipants({
            gameId: selectedGameId,
            tableId: table.id,
            data: {
              participant_ids: newIds
            }
          });
        }
      }
    } else {
      if (
        sourceContainer === 'user-list' &&
        destinationContainer !== 'user-list'
      ) {
        const destTable = tableList.find(
          (table) => table.id === destinationContainer
        );
        if (!destTable || (destTable.participants?.length ?? 0) >= maxPlayers)
          return;

        const participantIds = destTable.participants?.map((p) => p.id) ?? [];
        const destIndex =
          over.data.current?.sortable?.index ?? participantIds.length;

        if (!participantIds.includes(activeId)) {
          const newIds = [...participantIds];
          newIds.splice(destIndex, 0, activeId);
          changeParticipants({
            gameId: selectedGameId,
            tableId: destTable.id,
            data: {
              participant_ids: newIds
            }
          });
          setAvailableUsers((prev) => prev.filter((u) => u.id !== activeId));
        }
      } else if (
        sourceContainer !== 'user-list' &&
        destinationContainer === 'user-list'
      ) {
        const sourceTable = tableList.find(
          (table) => table.id === sourceContainer
        );
        if (!sourceTable) return;

        const participantIds = sourceTable.participants?.map((p) => p.id) ?? [];
        changeParticipants({
          gameId: selectedGameId,
          tableId: sourceTable.id,
          data: {
            participant_ids: participantIds.filter((id) => id !== activeId)
          }
        });

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
        const sourceTable = tableList.find(
          (table) => table.id === sourceContainer
        );
        const destTable = tableList.find(
          (table) => table.id === destinationContainer
        );

        if (
          !sourceTable ||
          !destTable ||
          (destTable.participants?.length ?? 0) >= maxPlayers
        )
          return;

        // Remove from source table
        const sourceParticipantIds =
          sourceTable.participants?.map((p) => p.id) ?? [];
        changeParticipants({
          gameId: selectedGameId,
          tableId: sourceTable.id,
          data: {
            participant_ids: sourceParticipantIds.filter(
              (id) => id !== activeId
            )
          }
        });

        // Add to destination table
        const destParticipantIds =
          destTable.participants?.map((p) => p.id) ?? [];
        const destIndex =
          over.data.current?.sortable?.index ?? destParticipantIds.length;
        if (!destParticipantIds.includes(activeId)) {
          const newIds = [...destParticipantIds];
          newIds.splice(destIndex, 0, activeId);
          changeParticipants({
            gameId: selectedGameId,
            tableId: destTable.id,
            data: {
              participant_ids: newIds
            }
          });
        }
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveUser(null);
  }

  function handleAddTable() {
    if (!newTableName.trim() || !selectedGameId) return;

    createGameTable({
      gameId: selectedGameId,
      data: {
        name: newTableName,
        max_players: maxPlayers
      }
    });

    setNewTableName('');
  }

  function handleDeleteTable(tableId: string) {
    if (!selectedGameId) return;

    const table = tableList.find((t) => t.id === tableId);
    if (!table) return;

    // Move participants back to available users list
    const participants = table.participants ?? [];
    const participantUsers = participants
      .map((p) => mockUsers.find((u) => u.id === p.id))
      .filter((u): u is User => u !== undefined);

    setAvailableUsers((prev) => [...prev, ...participantUsers]);

    // Delete the table
    deleteGameTable({
      gameId: selectedGameId,
      tableId: tableId
    });
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
            value={selectedGameId}
            onValueChange={(gameId) => {
              setSelectedGameId(gameId);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='게임 선택' />
            </SelectTrigger>
            <SelectContent>
              {games?.data?.map((game) => {
                const gameType = gameTypes?.data?.find(
                  (type) => type.id === game.game_type_id
                );
                return (
                  <SelectItem key={game.id} value={game.id}>
                    {gameType?.name ?? '알 수 없는 게임'} - {game.mode}
                  </SelectItem>
                );
              })}
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
              <SectionTitle>
                {gameTypes?.data?.find(
                  (type) => type.id === selectedGame.data?.game_type_id
                )?.name ?? '알 수 없는 게임'}{' '}
                - {selectedGame.data?.mode} - 테이블 현황
              </SectionTitle>
              <SectionContent>
                <div className='mb-4 flex items-center gap-2'>
                  <Input
                    type='text'
                    placeholder='새 테이블 이름'
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                  />
                  <Select
                    value={String(maxPlayers)}
                    onValueChange={(value) => setMaxPlayers(Number(value))}
                  >
                    <SelectTrigger className='w-[120px]'>
                      <SelectValue placeholder='최대 인원' />
                    </SelectTrigger>
                    <SelectContent>
                      {[4, 6, 8, 9, 10, 11].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num}명
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  {tableList.map((table) => (
                    <DroppableTable
                      key={table.id}
                      table={table}
                      users={mockUsers}
                      onDelete={() => handleDeleteTable(table.id)}
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

import { useQuery } from '@tanstack/react-query';
import { getGame, getStore } from '@/lib/api';
import { addMinutes, format, intervalToDuration } from 'date-fns';
import {
  TemplateData,
  GameItem
} from '@/features/game-management/types/game-structure';
import { useMemo, useState, useCallback, useEffect } from 'react';

// Types
export interface PrizeValues {
  first: string;
  second: string;
  third: string;
  fourth: string;
  fifth: string;
  sixth: string;
  gtd: string;
}

export interface StatusBoardInfo {
  storeName: string;
  gameName: string;
  currentLevel: number;
  remainingTime: string;
  blinds: {
    sb: number;
    bb: number;
    ante: number;
  };
  nextLevel: {
    regClose: number;
    name: string;
    blinds: string;
  };
  stats: {
    regCloseTime: string;
    nextBreak: string;
    players: string;
    rebuyEarly: string;
    totalChips: string;
    avgStack: string;
  };
}

// Constants
const STORAGE_KEY = 'prizeValues';
const DEFAULT_PRIZE_VALUES: PrizeValues = {
  first: 'APS INDEX POINT 100',
  second: 'APS INDEX POINT 60',
  third: 'APS INDEX POINT 50',
  fourth: 'APS INDEX POINT 40',
  fifth: 'APS INDEX POINT 30',
  sixth: '1개 케이스',
  gtd: 'APS INDEX POINT 300'
};

// Helper Functions
function getPrizeValues(gameId: string): PrizeValues {
  const stored = localStorage.getItem(`${STORAGE_KEY}_${gameId}`);
  return stored ? JSON.parse(stored) : DEFAULT_PRIZE_VALUES;
}

function savePrizeValues(gameId: string, values: PrizeValues) {
  localStorage.setItem(`${STORAGE_KEY}_${gameId}`, JSON.stringify(values));
}

export function useStatusBoard(gameId: string) {
  const [prizeValues, setPrizeValues] = useState<PrizeValues>(() =>
    getPrizeValues(gameId)
  );

  useEffect(() => {
    setPrizeValues(getPrizeValues(gameId));
  }, [gameId]);

  const handlePrizeChange = useCallback(
    (path: keyof PrizeValues, value: string) => {
      setPrizeValues((prev) => {
        const next = { ...prev, [path]: value };
        savePrizeValues(gameId, next);
        return next;
      });
    },
    [gameId]
  );

  const { data: game, isLoading: isGameLoading } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const response = await getGame({
        path: { gameId }
      });
      return response.data?.data;
    },
    refetchInterval: 1000 // 1초마다 갱신
  });

  const { data: store, isLoading: isStoreLoading } = useQuery({
    queryKey: ['store', game?.store_id],
    queryFn: async () => {
      if (!game?.store_id) return null;
      const response = await getStore({
        path: { storeId: game.store_id }
      });
      return response.data?.data;
    },
    enabled: !!game?.store_id
  });

  const statusBoard = useMemo(() => {
    const calculateStatusBoard = (): StatusBoardInfo | null => {
      if (!game || !store) return null;

      const now = new Date();
      const gameStartTime = new Date(game.scheduled_at);
      const gameStructure = JSON.parse(game.structures) as TemplateData;
      const firstLevel = gameStructure.items[0] as GameItem;

      if (!firstLevel.duration) return null;

      const levelDurationMinutes = firstLevel.duration;
      const elapsedMinutes =
        (now.getTime() - gameStartTime.getTime()) / (60 * 1000);
      const currentLevelIndex = Math.max(
        0,
        Math.min(
          Math.floor(elapsedMinutes / levelDurationMinutes),
          gameStructure.items.length - 1
        )
      );

      // 현재 레벨의 시작 시간
      const currentLevelStartTime = addMinutes(
        gameStartTime,
        currentLevelIndex * levelDurationMinutes
      );
      // 다음 레벨의 시작 시간
      const nextLevelStartTime = addMinutes(
        currentLevelStartTime,
        levelDurationMinutes
      );

      // 남은 시간 계산
      const duration = intervalToDuration({
        start: now,
        end: nextLevelStartTime
      });

      const currentLevel = gameStructure.items[currentLevelIndex] as GameItem;
      const nextLevel = gameStructure.items[currentLevelIndex + 1] as
        | GameItem
        | undefined;

      if (!currentLevel) return null;

      const totalChips = (game.starting_chips ?? 0) * (game.max_players ?? 0);

      return {
        storeName: store.name,
        gameName: '임시 게임 이름',
        currentLevel: currentLevelIndex + 1,
        remainingTime: `${duration.minutes?.toString().padStart(2, '0') ?? '00'}:${
          duration.seconds?.toString().padStart(2, '0') ?? '00'
        }`,
        blinds: {
          sb: currentLevel.sb ?? 0,
          bb: currentLevel.bb ?? 0,
          ante: currentLevel.entry ?? 0
        },
        nextLevel: {
          regClose: game.reg_close_level ?? 0,
          name:
            nextLevel?.type === 'break'
              ? 'BREAK'
              : `LEVEL ${currentLevelIndex + 2}`,
          blinds: nextLevel
            ? nextLevel.type === 'break'
              ? '-'
              : `${nextLevel.sb ?? 0}/${nextLevel.bb ?? 0}(${nextLevel.entry ?? 0})`
            : 'FINAL'
        },
        stats: {
          regCloseTime: format(
            addMinutes(
              gameStartTime,
              ((game.reg_close_level ?? 1) - 1) * levelDurationMinutes
            ),
            'HH:mm:ss'
          ),
          nextBreak: format(
            addMinutes(
              gameStartTime,
              (gameStructure.items.findIndex(
                (item) =>
                  item.type === 'break' &&
                  gameStructure.items.indexOf(item) > currentLevelIndex
              ) || 0) * levelDurationMinutes
            ),
            'HH:mm:ss'
          ),
          players: `${game.max_players ?? 0} / ${game.max_players ?? 0}`,
          rebuyEarly: `${game.reentry_chips ?? 0} / ${game.early_chips ?? 0}`,
          totalChips: totalChips.toLocaleString(),
          avgStack: Math.floor(
            totalChips / (game.max_players || 1)
          ).toLocaleString()
        }
      };
    };

    return game && store ? calculateStatusBoard() : null;
  }, [game, store]);

  return {
    statusBoard,
    isLoading: isGameLoading || isStoreLoading,
    prizeValues,
    handlePrizeChange
  };
}

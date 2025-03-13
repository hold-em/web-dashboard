import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getGame, getStore } from '@/lib/api';
import {
  addMinutes,
  format,
  intervalToDuration,
  isBefore,
  Duration
} from 'date-fns';
import {
  TemplateData,
  GameItem
} from '@/features/game-management/types/game-structure';
import { useMemo, useState, useCallback, useEffect, useRef } from 'react';

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
  currentLevelEndTime: Date;
  isBeforeStart?: boolean;
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
    regCloseTime: {
      time: string;
    };
    nextBreak: {
      time: string;
    };
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

function formatDuration(duration: Duration): string {
  const minutes = duration.minutes ?? 0;
  const seconds = duration.seconds ?? 0;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function calculateLevelStartTime(
  gameStartTime: Date,
  items: GameItem[],
  targetIndex: number
): Date {
  let totalMinutes = 0;
  for (let i = 0; i < targetIndex; i++) {
    const item = items[i];
    totalMinutes +=
      item.type === 'break' ? (item.breakDuration ?? 0) : (item.duration ?? 0);
  }
  return addMinutes(gameStartTime, totalMinutes);
}

function findNextBreakIndex(items: GameItem[], currentIndex: number): number {
  return items
    .slice(currentIndex + 1)
    .findIndex((item) => item.type === 'break');
}

function calculateMinutesUntil(from: Date, to: Date): number {
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / (60 * 1000)));
}

export function useStatusBoard(gameId: string) {
  const [prizeValues, setPrizeValues] = useState<PrizeValues>(() =>
    getPrizeValues(gameId)
  );
  const [remainingTime, setRemainingTime] = useState<string>('00:00');
  const [regCloseTime, setRegCloseTime] = useState<string>('00:00');
  const [nextBreakTime, setNextBreakTime] = useState<string>('00:00');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentLevelEndTimeRef = useRef<Date | null>(null);
  const regCloseTimeRef = useRef<Date | null>(null);
  const nextBreakTimeRef = useRef<Date | null>(null);
  const queryClient = useQueryClient();

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

      // 게임 시작 전인지 확인
      const isBeforeStart = isBefore(now, gameStartTime);
      if (isBeforeStart) {
        // 시작까지 남은 시간 계산
        const duration = intervalToDuration({
          start: now,
          end: gameStartTime
        });

        return {
          storeName: store.name,
          gameName: '임시 게임 이름',
          currentLevel: 1,
          remainingTime: formatDuration(duration),
          currentLevelEndTime: gameStartTime,
          isBeforeStart: true,
          blinds: {
            sb: 0,
            bb: 0,
            ante: 0
          },
          nextLevel: {
            regClose: 0,
            name: '--',
            blinds: '--'
          },
          stats: {
            regCloseTime: {
              time: '--:--'
            },
            nextBreak: {
              time: '--:--'
            },
            players: `${game.max_players ?? 0} / ${game.max_players ?? 0}`,
            rebuyEarly: `${game.reentry_chips ?? 0} / ${game.early_chips ?? 0}`,
            totalChips: (game.starting_chips ?? 0).toLocaleString(),
            avgStack: Math.floor(game.starting_chips ?? 0).toLocaleString()
          }
        };
      }

      const gameStructure = JSON.parse(game.structures) as TemplateData;
      const items = gameStructure.items;

      // 현재 레벨 찾기
      let currentLevelIndex = 0;
      let accumulatedMinutes = 0;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const duration =
          item.type === 'break'
            ? (item.breakDuration ?? 0)
            : (item.duration ?? 0);

        if (
          accumulatedMinutes + duration >
          (now.getTime() - gameStartTime.getTime()) / (60 * 1000)
        ) {
          currentLevelIndex = i;
          break;
        }

        accumulatedMinutes += duration;
        if (i === items.length - 1) {
          currentLevelIndex = i;
        }
      }

      const currentLevel = items[currentLevelIndex] as GameItem;
      const nextLevel = items[currentLevelIndex + 1] as GameItem | undefined;

      if (!currentLevel) return null;

      // 현재 레벨의 시작 시간과 종료 시간 계산
      const currentLevelStartTime = calculateLevelStartTime(
        gameStartTime,
        items,
        currentLevelIndex
      );
      const currentLevelDuration =
        currentLevel.type === 'break'
          ? (currentLevel.breakDuration ?? 0)
          : (currentLevel.duration ?? 0);
      const nextLevelStartTime = addMinutes(
        currentLevelStartTime,
        currentLevelDuration
      );

      // REG CLOSE TIME 계산
      const regCloseLevelIndex = (game.reg_close_level ?? 1) - 1;
      const regCloseDateTime = calculateLevelStartTime(
        gameStartTime,
        items,
        regCloseLevelIndex
      );
      regCloseTimeRef.current = regCloseDateTime;

      // NEXT BREAK 계산
      const nextBreakIdx = findNextBreakIndex(items, currentLevelIndex);
      const nextBreakDateTime =
        nextBreakIdx !== -1
          ? calculateLevelStartTime(
              gameStartTime,
              items,
              currentLevelIndex + 1 + nextBreakIdx
            )
          : null;
      nextBreakTimeRef.current = nextBreakDateTime;

      // 남은 시간 계산
      const duration = intervalToDuration({
        start: now,
        end: nextLevelStartTime
      });

      const totalChips = (game.starting_chips ?? 0) * (game.max_players ?? 0);

      // 현재 레벨의 종료 시간 저장
      currentLevelEndTimeRef.current = nextLevelStartTime;

      return {
        storeName: store.name,
        gameName: '임시 게임 이름',
        currentLevel:
          currentLevel.type === 'break'
            ? 0
            : (currentLevel.level ?? currentLevelIndex + 1),
        remainingTime: formatDuration(duration),
        currentLevelEndTime: nextLevelStartTime,
        isBeforeStart: false,
        blinds: {
          sb: currentLevel.type === 'game' ? (currentLevel.sb ?? 0) : 0,
          bb: currentLevel.type === 'game' ? (currentLevel.bb ?? 0) : 0,
          ante: currentLevel.type === 'game' ? (currentLevel.entry ?? 0) : 0
        },
        nextLevel: {
          regClose: game.reg_close_level ?? 0,
          name: nextLevel
            ? nextLevel.type === 'break'
              ? 'BREAK'
              : `LEVEL ${nextLevel?.level ?? currentLevelIndex + 2}`
            : 'FINAL',
          blinds: nextLevel
            ? nextLevel.type === 'break'
              ? '-'
              : `${nextLevel.sb ?? 0}/${nextLevel.bb ?? 0}${
                  nextLevel.entry ? ` (${nextLevel.entry})` : ''
                }`
            : 'FINAL'
        },
        stats: {
          regCloseTime: {
            time: format(regCloseDateTime, 'HH:mm:ss')
          },
          nextBreak: {
            time: nextBreakDateTime
              ? format(nextBreakDateTime, 'HH:mm:ss')
              : '--:--:--'
          },
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

  // 타이머 설정
  useEffect(() => {
    if (!statusBoard?.currentLevelEndTime || !game) return;

    const updateTimer = () => {
      const now = new Date();
      const gameStartTime = new Date(game.scheduled_at);
      const isBeforeStart = isBefore(now, gameStartTime);

      if (isBeforeStart) {
        // 게임 시작까지 남은 시간 표시
        const duration = intervalToDuration({
          start: now,
          end: gameStartTime
        });
        setRemainingTime(formatDuration(duration));
        setRegCloseTime('--:--');
        setNextBreakTime('--:--');
        return;
      }

      // 레벨 타이머 업데이트
      if (currentLevelEndTimeRef.current) {
        if (isBefore(currentLevelEndTimeRef.current, now)) {
          setRemainingTime('00:00');
          // 레벨이 끝났을 때 refetch 트리거
          if (game) {
            // @ts-ignore - queryClient is available through useQuery
            queryClient.invalidateQueries(['game', game.id]);
          }
        } else {
          const duration = intervalToDuration({
            start: now,
            end: currentLevelEndTimeRef.current
          });
          setRemainingTime(formatDuration(duration));
        }
      }

      // REG CLOSE TIME 업데이트
      if (regCloseTimeRef.current) {
        if (isBefore(regCloseTimeRef.current, now)) {
          setRegCloseTime('00:00');
        } else {
          const duration = intervalToDuration({
            start: now,
            end: regCloseTimeRef.current
          });
          setRegCloseTime(formatDuration(duration));
        }
      }

      // NEXT BREAK 업데이트
      if (nextBreakTimeRef.current) {
        if (isBefore(nextBreakTimeRef.current, now)) {
          setNextBreakTime('00:00');
        } else {
          const duration = intervalToDuration({
            start: now,
            end: nextBreakTimeRef.current
          });
          setNextBreakTime(formatDuration(duration));
        }
      }
    };

    // 초기 타이머 설정
    updateTimer();

    // 1초마다 타이머 업데이트
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [statusBoard?.currentLevelEndTime, game]);

  return {
    statusBoard: statusBoard
      ? {
          ...statusBoard,
          remainingTime,
          isBeforeStart: statusBoard.isBeforeStart,
          stats: {
            ...statusBoard.stats,
            regCloseTime: {
              ...statusBoard.stats.regCloseTime,
              time: regCloseTime
            },
            nextBreak: {
              ...statusBoard.stats.nextBreak,
              time: nextBreakTime
            }
          }
        }
      : null,
    isLoading: isGameLoading || isStoreLoading,
    prizeValues,
    handlePrizeChange
  };
}

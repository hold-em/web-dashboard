import { useState, useEffect } from 'react';

export function usePageNavigation<T extends string>(initialPage: T) {
  const [page, setPage] = useState<T>(initialPage);

  useEffect(() => {
    window.history.replaceState({ page } as { page: T }, '', `?page=${page}`);

    const onPopState = (event: PopStateEvent) => {
      const state = event.state as { page: T } | null;
      if (state && state.page) {
        setPage(state.page);
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [page]);

  const navigateTo = (newPage: T) => {
    setPage(newPage);
    window.history.pushState(
      { page: newPage } as { page: T },
      '',
      `?page=${newPage}`
    );
  };

  return { page, navigateTo, setPage };
}

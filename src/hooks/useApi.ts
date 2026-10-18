/**
 * 通用数据加载 hook。
 * - 自动处理 loading / error
 * - 监听 ps:data-changed,数据变更后自动重新加载
 */

import { useCallback, useEffect, useState } from 'react';
import type { DependencyList } from 'react';
import { DATA_EVENT } from '../api/storage';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetcher();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    void load();

    const handler = (): void => {
      void load();
    };
    window.addEventListener(DATA_EVENT, handler);
    return () => window.removeEventListener(DATA_EVENT, handler);
  }, [load]);

  return { data, loading, error, reload: load };
}

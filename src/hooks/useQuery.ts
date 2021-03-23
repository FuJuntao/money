import type { ExecutionResult } from 'graphql';
import { useEffect, useState } from 'react';
import { makeQuery } from '../graphql/makeQuery';

export const useQuery = <Result>(source: string) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<null | ExecutionResult<Result>>(null);

  useEffect(() => {
    async function query() {
      try {
        const result = await makeQuery<Result>(source);
        setResult(result);
      } finally {
        setLoading(false);
      }
    }

    query();
  }, [source]);

  return {
    data: result?.data ?? null,
    errors: result?.errors ?? null,
    loading,
  };
};

import type { ExecutionResult } from 'graphql';
import { useEffect, useState } from 'react';
import { makeQuery } from '../graphql/makeQuery';

export const useQuery = (source: string) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<null | ExecutionResult>(null);

  useEffect(() => {
    async function query() {
      try {
        const result = await makeQuery(source);
        setResult(result);
      } finally {
        setLoading(false);
      }
    }

    query();
  }, []);

  return {
    data: result?.data,
    errors: result?.errors,
    loading,
  };
};

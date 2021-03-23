import { useBoolean } from '@chakra-ui/react';
import type { ExecutionResult } from 'graphql';
import { useEffect, useState } from 'react';
import { makeQuery } from '../graphql/makeQuery';

export const useQuery = <Result>(source: string) => {
  const [isLoading, { on: setIsLoading, off: setIsNotLoading }] = useBoolean(
    true,
  );

  const [result, setResult] = useState<null | ExecutionResult<Result>>(null);

  useEffect(() => {
    async function query() {
      try {
        setIsLoading();
        const result = await makeQuery<Result>({ source });
        setResult(result);
      } finally {
        setIsNotLoading();
      }
    }

    query();
  }, [setIsLoading, setIsNotLoading, source]);

  return {
    data: result?.data ?? null,
    errors: result?.errors ?? null,
    isLoading,
  };
};

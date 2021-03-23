import { useBoolean } from '@chakra-ui/react';
import type { ExecutionResult } from 'graphql';
import { useCallback, useEffect, useState } from 'react';
import { makeQuery } from '../graphql/makeQuery';

interface QueryOptions<Variables> {
  variables: Variables;
}

export const useQuery = <Result, Variables = unknown>(
  source: string,
  options?: QueryOptions<Variables>,
) => {
  const [isLoading, { on: setIsLoading, off: setIsNotLoading }] = useBoolean(
    true,
  );

  const [result, setResult] = useState<null | ExecutionResult<Result>>(null);

  const query = useCallback(
    async (variables?: Variables) => {
      try {
        setIsLoading();
        const result = await makeQuery<Result>({
          source,
          variableValues: variables ?? options?.variables,
        });
        setResult(result);
      } finally {
        setIsNotLoading();
      }
    },
    [options?.variables, setIsLoading, setIsNotLoading, source],
  );

  useEffect(() => {
    query(options?.variables);
  }, [options?.variables, query]);

  return {
    query,
    data: result?.data ?? null,
    errors: result?.errors ?? null,
    isLoading,
  };
};

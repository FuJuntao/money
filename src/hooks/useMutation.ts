import { useBoolean } from '@chakra-ui/react';
import type { ExecutionResult } from 'graphql';
import { useCallback, useState } from 'react';
import { makeQuery } from '../graphql/makeQuery';

interface Options<Variables> {
  variables: Variables;
}

export const useMutation = <Result, Variables>(
  source: string,
  options?: Options<Variables>,
) => {
  const [isLoading, { on: setIsLoading, off: setIsNotLoading }] = useBoolean();
  const [result, setResult] = useState<null | ExecutionResult<Result>>(null);

  const mutate = useCallback(
    async (variables) => {
      try {
        setIsLoading();
        const result = await makeQuery<Result>({
          source,
          variableValues: variables ?? options?.variables,
        });
        setResult(result);
        return result;
      } finally {
        setIsNotLoading();
      }
    },
    [options?.variables, setIsLoading, setIsNotLoading, source],
  );

  return {
    mutate,
    data: result?.data ?? null,
    errors: result?.errors ?? null,
    isLoading,
  };
};

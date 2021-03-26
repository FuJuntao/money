import { useBoolean } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

export const useMutation = <Args extends unknown[], Returned = unknown>(
  fn: (...args: Args) => Returned,
) => {
  const [isLoading, { on: setIsLoading, off: setIsNotLoading }] = useBoolean();
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<null | Returned>(null);

  const mutate = useCallback(
    async (...args: Args) => {
      try {
        setIsLoading();
        const result = await fn(...args);
        setResult(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setIsNotLoading();
      }
    },
    [fn, setIsLoading, setIsNotLoading],
  );

  return {
    mutate,
    data: result,
    errors: error,
    isLoading,
  };
};

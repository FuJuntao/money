import { ChakraProvider, Heading, Spinner, Stack } from '@chakra-ui/react';
import type { ExecutionResult } from 'graphql';
import React, { useEffect, useState } from 'react';
import { makeQuery } from './graphql/makeQuery';

const useQuery = (source: string) => {
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
    loading,
    data: result?.data,
    errors: result?.errors,
  };
};

function App() {
  const { data, loading } = useQuery('{ accounts { id name } }');

  return (
    <ChakraProvider>
      <Heading as="h1">Hello</Heading>
      <Heading>Accounts</Heading>
      {loading ? (
        <Spinner />
      ) : (
        <Stack>
          {data?.accounts.map((account: any) => (
            <Heading as="h3">{account.name}</Heading>
          ))}
        </Stack>
      )}
    </ChakraProvider>
  );
}

export default App;

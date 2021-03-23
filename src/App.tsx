import { ChakraProvider, Heading, Spinner, Stack } from '@chakra-ui/react';
import React from 'react';
import { useQuery } from './hooks/useQuery';

interface ResultData {
  accounts: { id: string; name: string }[];
}

function App() {
  const { data, loading } = useQuery<ResultData>('{ accounts { id name } }');

  return (
    <ChakraProvider>
      <Heading as="h1">Hello</Heading>
      <Heading>Accounts</Heading>
      {loading ? (
        <Spinner />
      ) : (
        <Stack>
          {data?.accounts.map((account) => (
            <Heading as="h3">{account.name}</Heading>
          ))}
        </Stack>
      )}
    </ChakraProvider>
  );
}

export default App;

import { ChakraProvider, Heading, Spinner, Stack } from '@chakra-ui/react';
import React from 'react';
import AddAccount from './accounts/AddAccount';
import { useQuery } from './hooks/useQuery';

interface ResultData {
  accounts: { id: string; name: string }[];
}

function App() {
  const { data, isLoading } = useQuery<ResultData>('{ accounts { id name } }');

  return (
    <ChakraProvider>
      <Heading as="h1">Hello</Heading>

      <Heading>Accounts</Heading>
      <AddAccount />
      {isLoading ? (
        <Spinner />
      ) : (
        <Stack>
          {data?.accounts.map((account) => (
            <Heading key={account.id} as="h3">
              {account.name}
            </Heading>
          ))}
        </Stack>
      )}
    </ChakraProvider>
  );
}

export default App;

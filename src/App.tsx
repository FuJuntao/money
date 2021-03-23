import { ChakraProvider, Heading } from '@chakra-ui/react';
import React from 'react';
import AccountList from './accounts/AccountList';
import { theme } from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Heading as="h1">Hello</Heading>

      <AccountList />
    </ChakraProvider>
  );
}

export default App;

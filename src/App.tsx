import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import AccountList from './accounts/AccountList';
import { theme } from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AccountList />
    </ChakraProvider>
  );
}

export default App;

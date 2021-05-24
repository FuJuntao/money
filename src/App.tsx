import { ChakraProvider } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import Page404 from './pages/404';
import Settings from './pages/Settings';
import { theme } from './theme';
import TransactionsIndexPage from './transactions/TransactionsIndexPage';

function Providers(props: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>{props.children}</ChakraProvider>
    </BrowserRouter>
  );
}

function Routes() {
  return useRoutes(
    [
      { path: '/', element: <TransactionsIndexPage /> },
      { path: 'settings/*', element: <Settings /> },
      { path: '*', element: <Page404 /> },
    ],
    import.meta.env.SNOWPACK_PUBLIC_BASE_URL,
  );
}

function App() {
  return (
    <Providers>
      <Routes />
    </Providers>
  );
}

export default App;

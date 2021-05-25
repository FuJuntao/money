import { ChakraProvider } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './pages';
import Page404 from './pages/404';
import { theme } from './theme';

function Providers(props: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>{props.children}</ChakraProvider>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Providers>
      <Routes>
        <Route
          path={`${import.meta.env.SNOWPACK_PUBLIC_BASE_URL ?? ''}/*`}
          element={<Homepage />}
        />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Providers>
  );
}

export default App;

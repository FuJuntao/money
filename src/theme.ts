import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      html: { height: '100%' },
      body: { height: '100%' },
      '#root': { height: '100%' },
    },
  },
});

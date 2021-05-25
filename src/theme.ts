import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      html: { h: 'full' },
      body: { h: 'full' },
      '#root': { h: 'full' },
    },
  },
});

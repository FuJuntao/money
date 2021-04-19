import { chakra, ChakraProps } from '@chakra-ui/react';
import React, { forwardRef } from 'react';

const Amount = forwardRef<
  HTMLSpanElement,
  ChakraProps & { children: number; currency: string }
>((props, ref) => {
  const { children, currency, ...otherProps } = props;

  return (
    <chakra.span ref={ref} {...otherProps}>
      {Intl.NumberFormat(undefined, { style: 'currency', currency }).format(
        children,
      )}
    </chakra.span>
  );
});

export default Amount;

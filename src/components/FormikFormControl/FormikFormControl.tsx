import {
  Collapse,
  FormControl,
  FormControlProps,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FieldInputProps, useField } from 'formik';
import React, { ReactNode } from 'react';

type FormikFormControlProps<Value> = Omit<
  FormControlProps,
  'children' | 'id'
> & {
  id: string;
  children: (props: FieldInputProps<Value>) => ReactNode;
};

export default function FormikFormControl<Value = unknown>(
  props: FormikFormControlProps<Value>,
) {
  const { children, ...otherProps } = props;

  const [fieldInputProps, { touched, error }] = useField(props.id);
  const isInvalid = !!(touched && error);

  return (
    <FormControl isInvalid={isInvalid} {...otherProps}>
      {children(fieldInputProps)}

      <Collapse in={isInvalid}>
        <FormErrorMessage>{error}</FormErrorMessage>
      </Collapse>
    </FormControl>
  );
}

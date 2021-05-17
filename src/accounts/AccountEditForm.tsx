import { Input, ModalBody, VStack } from '@chakra-ui/react';
import { Form, FormikProps, FormikProvider, useFormik } from 'formik';
import React, { ReactNode, useMemo } from 'react';
import * as yup from 'yup';
import FormikFormControl from '../components/FormikFormControl';

export type Values = {
  name: string;
};

interface AccountEditFormProps {
  initialValues?: Partial<Values>;
  renderActions?: (formik: FormikProps<Values>) => ReactNode;
  onSubmit: (values: Values) => void | Promise<void>;
}

const validationSchema = yup.object().shape({
  name: yup.string().required(),
});

export default function AccountEditForm(props: AccountEditFormProps) {
  const { initialValues: initialValuesProp, renderActions, onSubmit } = props;

  const initialValues = useMemo(
    () => ({
      name: initialValuesProp?.name ?? '',
    }),
    [initialValuesProp?.name],
  );

  const formik = useFormik<Values>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => onSubmit(values),
  });

  return (
    <FormikProvider value={formik}>
      <Form>
        <ModalBody as={VStack} spacing={4}>
          <FormikFormControl<Values['name']> id="name">
            {(props) => <Input {...props} placeholder="Account name" />}
          </FormikFormControl>
        </ModalBody>

        {renderActions?.(formik)}
      </Form>
    </FormikProvider>
  );
}

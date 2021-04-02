import { Input, ModalBody, Select, VStack } from '@chakra-ui/react';
import { Form, FormikProps, FormikProvider, useFormik } from 'formik';
import React, { ReactNode, useMemo } from 'react';
import * as yup from 'yup';
import FormikFormControl from '../components/FormikFormControl';
import type { AccountType } from '../database/accounts/types';
import { accountTypeTitle } from './AccountListItem';

export type Values = {
  name: string;
  type: string;
};

interface AccountEditFormProps {
  initialValues?: Partial<Values>;
  renderActions?: (formik: FormikProps<Values>) => ReactNode;
  onSubmit: (values: Values) => void | Promise<void>;
}

const accountTypes: AccountType[] = ['payment_account', 'credit_card', 'asset'];

const validationSchema = yup.object().shape({
  name: yup.string().required(),
  type: yup.string().required(),
});

export default function AccountEditForm(props: AccountEditFormProps) {
  const { initialValues: initialValuesProp, renderActions, onSubmit } = props;

  const initialValues = useMemo(
    () => ({
      name: initialValuesProp?.name ?? '',
      type: initialValuesProp?.type ?? '',
    }),
    [initialValuesProp?.name, initialValuesProp?.type],
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

          <FormikFormControl<Values['type']> id="type">
            {(props) => (
              <Select {...props} placeholder="Select an account type">
                {accountTypes.map((accountType) => (
                  <option key={accountType} value={accountType}>
                    {accountTypeTitle[accountType]}
                  </option>
                ))}
              </Select>
            )}
          </FormikFormControl>
        </ModalBody>

        {renderActions?.(formik)}
      </Form>
    </FormikProvider>
  );
}

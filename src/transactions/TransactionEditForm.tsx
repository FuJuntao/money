import {
  ModalBody,
  NumberInput,
  NumberInputField,
  Select,
  VStack,
} from '@chakra-ui/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Form, FormikProps, FormikProvider, useFormik } from 'formik';
import React, { ReactNode, useMemo } from 'react';
import * as yup from 'yup';
import FormikFormControl from '../components/FormikFormControl';
import { getAccounts } from '../database/accounts/getAccounts';
import type { ID } from '../database/MoneyDB';

interface Values {
  amount: string;
  accountId: ID | string;
}

export interface SubmitValues {
  amount: number;
  accountId: ID;
}

interface TransactionEditFormProps {
  initialValues?: Partial<Values>;
  renderActions?: (formik: FormikProps<Values>) => ReactNode;
  onSubmit: (values: SubmitValues) => void | Promise<void>;
}

const validationSchema = yup.object({
  amount: yup.number().label('Amount').required().moreThan(0).maxDigits(2),
  accountId: yup.number().label('Account').required(),
});

export default function TransactionEditForm(props: TransactionEditFormProps) {
  const { initialValues: initialValuesProp, renderActions, onSubmit } = props;

  const initialValues = useMemo(
    () => ({
      amount: initialValuesProp?.amount ?? '',
      accountId: initialValuesProp?.accountId ?? '',
    }),
    [initialValuesProp?.accountId, initialValuesProp?.amount],
  );

  const handleSubmit = async ({ amount, accountId }: Values) =>
    onSubmit({
      amount: Number.parseFloat(amount),
      accountId: Number.parseInt(accountId.toString()),
    });

  const formik = useFormik<Values>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const amountField = (
    <FormikFormControl<Values['amount']> id="amount">
      {(props) => (
        <NumberInput
          {...props}
          min={0}
          onChange={(valueAsString) =>
            formik.setFieldValue('amount', valueAsString)
          }
        >
          <NumberInputField placeholder="Amount" />
        </NumberInput>
      )}
    </FormikFormControl>
  );

  const accounts = useLiveQuery(getAccounts);
  const accountField = (
    <FormikFormControl<Values['accountId']> id="accountId">
      {(props) => (
        <Select {...props} placeholder="Select an account">
          {accounts?.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>
      )}
    </FormikFormControl>
  );

  return (
    <FormikProvider value={formik}>
      <Form>
        <ModalBody as={VStack} spacing={4}>
          {amountField}
          {accountField}
        </ModalBody>

        {renderActions?.(formik)}
      </Form>
    </FormikProvider>
  );
}

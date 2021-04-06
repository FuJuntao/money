import {
  Collapse,
  ModalBody,
  NumberInput,
  NumberInputField,
  Select,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Form,
  FormikProps,
  FormikProvider,
  useFormik,
  useFormikContext,
} from 'formik';
import React, { ReactNode, useMemo } from 'react';
import * as yup from 'yup';
import FormikFormControl from '../components/FormikFormControl';
import { db, ID } from '../database/MoneyDB';
import type { TransactionType } from '../database/transactions/types';

const getAccounts = () => db.accounts.toArray();

interface Values {
  accountId: string;
  amount: string;
  oppositeAccountId: string;
  remark: string;
  transactionType: TransactionType;
}

const transactionTypes: TransactionType[] = ['out', 'in', 'transfer'];

export const transactionTypeTitle: Record<TransactionType, string> = {
  out: 'Expense',
  in: 'Income',
  transfer: 'Transfer',
};

function TransactionTypeField() {
  return (
    <FormikFormControl<Values['transactionType']> id="transactionType">
      {(props) => (
        <Select {...props}>
          {transactionTypes?.map((type) => (
            <option key={type} value={type}>
              {transactionTypeTitle[type]}
            </option>
          ))}
        </Select>
      )}
    </FormikFormControl>
  );
}

function AmountField() {
  const formik = useFormikContext();

  return (
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
}

function AccountField() {
  const accounts = useLiveQuery(getAccounts);

  return (
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
}

function TransferToAccountField() {
  const accounts = useLiveQuery(getAccounts);

  return (
    <FormikFormControl<Values['oppositeAccountId']> id="oppositeAccountId">
      {(props) => (
        <Select {...props} placeholder="Transfer to">
          {accounts?.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>
      )}
    </FormikFormControl>
  );
}

function RemarkField() {
  return (
    <FormikFormControl<Values['remark']> id="remark">
      {(props) => <Textarea {...props} placeholder="Remark" />}
    </FormikFormControl>
  );
}

export interface InitialValues {
  accountId?: ID;
  amount?: number;
  oppositeAccountId?: ID;
  remark?: string;
  transactionType?: TransactionType;
}

export interface SubmitValues {
  accountId: ID;
  amount: number;
  oppositeAccountId?: ID;
  remark: string;
  transactionType: TransactionType;
}

interface TransactionEditFormProps {
  initialValues?: InitialValues;
  renderActions?: (formik: FormikProps<Values>) => ReactNode;
  onSubmit: (values: SubmitValues) => void | Promise<void>;
}

const validationSchema = yup.object({
  transactionType: yup.string().required(),
  amount: yup.number().label('Amount').required().moreThan(0).maxDigits(2),
  accountId: yup.string().label('Account').required(),
  oppositeAccountId: yup
    .string()
    .label('Transfer to')
    .when('transactionType', { is: 'transfer', then: yup.string().required() }),
});

export default function TransactionEditForm(props: TransactionEditFormProps) {
  const { initialValues: initialValuesProp, renderActions, onSubmit } = props;

  const initialValues = useMemo<Values>(
    () => ({
      accountId: initialValuesProp?.accountId?.toString() ?? '',
      amount: initialValuesProp?.amount?.toString() ?? '',
      oppositeAccountId: initialValuesProp?.oppositeAccountId?.toString() ?? '',
      remark: initialValuesProp?.remark ?? '',
      transactionType: initialValuesProp?.transactionType ?? 'out',
    }),
    [
      initialValuesProp?.accountId,
      initialValuesProp?.amount,
      initialValuesProp?.oppositeAccountId,
      initialValuesProp?.remark,
      initialValuesProp?.transactionType,
    ],
  );

  const handleSubmit = async ({
    accountId,
    amount,
    oppositeAccountId,
    remark,
    transactionType,
  }: Values) =>
    onSubmit({
      transactionType,
      amount: Number.parseFloat(amount),
      accountId: Number.parseInt(accountId.toString()),
      ...(transactionType === 'transfer'
        ? {
            oppositeAccountId: Number.parseInt(oppositeAccountId.toString()),
          }
        : null),
      remark,
    });

  const formik = useFormik<Values>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <FormikProvider value={formik}>
      <Form>
        <ModalBody as={VStack} align="stretch" spacing={4}>
          <TransactionTypeField />
          <AmountField />
          <AccountField />
          <Collapse in={formik.values.transactionType === 'transfer'}>
            <TransferToAccountField />
          </Collapse>
          <RemarkField />
        </ModalBody>

        {renderActions?.(formik)}
      </Form>
    </FormikProvider>
  );
}

import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  useToast,
} from '@chakra-ui/react';
import Dexie from 'dexie';
import React from 'react';
import { addTransaction } from '../database/transactions/addTransaction';
import type { Transaction } from '../database/transactions/types';
import { useMutation } from '../hooks/useMutation';
import TransactionEditForm, {
  InitialValues,
  SubmitValues,
  transactionTypeTitle,
} from './TransactionEditForm';

interface AddTransactionModalContentProps {
  initialValues?: InitialValues;
  onSuccess?: (transaction: Transaction) => void;
}

function AddTransactionModalContent(props: AddTransactionModalContentProps) {
  const toast = useToast();
  const { initialValues, onSuccess } = props;

  const { mutate } = useMutation(addTransaction);
  const handleSubmitForm = async (values: SubmitValues) => {
    try {
      const result = await mutate({
        accountId: values.accountId,
        amount: values.amount,
        remark: values.remark,
        transactionType: values.transactionType,
        transferToAccountId: values.transferToAccountId,
      });

      if (result) {
        toast({
          title: `${
            transactionTypeTitle[result.transactionType]
          } successfully created`,
          status: 'success',
          isClosable: true,
        });
        if (onSuccess) onSuccess(result);
      }
    } catch (err: unknown) {
      if (err instanceof Dexie.DexieError)
        toast({ title: err.message, status: 'error', isClosable: true });
    }
  };

  return (
    <ModalContent>
      <ModalHeader>Transaction</ModalHeader>
      <ModalCloseButton />
      <TransactionEditForm
        initialValues={initialValues}
        renderActions={(formik) => (
          <ModalFooter>
            <Button type="submit" isLoading={formik.isSubmitting}>
              Add
            </Button>
          </ModalFooter>
        )}
        onSubmit={handleSubmitForm}
      />
    </ModalContent>
  );
}

type AddTransactionModalProps = Omit<ModalProps, 'children'> &
  AddTransactionModalContentProps;

function AddTransactionModal(props: AddTransactionModalProps) {
  const { initialValues, onSuccess, ...otherProps } = props;

  return (
    <Modal {...otherProps}>
      <ModalOverlay />
      <AddTransactionModalContent
        initialValues={initialValues}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}

export default AddTransactionModal;

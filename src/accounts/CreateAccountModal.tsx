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
import React from 'react';
import { createAccount } from '../database/accounts/createAccount';
import type { Account, AccountType } from '../database/accounts/types';
import { useMutation } from '../hooks/useMutation';
import AccountEditForm, { Values } from './AccountEditForm';

interface CreateAccountModalContentProps {
  account?: Partial<Account>;
  onSuccess?: (account: Account) => void;
}

function CreateAccountModalContent(props: CreateAccountModalContentProps) {
  const toast = useToast();
  const { account, onSuccess } = props;

  const { mutate } = useMutation(createAccount);

  const onSubmit = async ({ name, type }: Values) => {
    const result = await mutate({ name, type: type as AccountType });
    if (result) {
      toast({
        title: `Account '${result.name}' successfully created`,
        status: 'success',
        isClosable: true,
      });
      if (onSuccess) onSuccess(result);
    }
  };

  return (
    <ModalContent>
      <ModalHeader>New Account</ModalHeader>
      <ModalCloseButton />

      <AccountEditForm
        initialValues={account}
        renderActions={(formik) => (
          <ModalFooter>
            <Button isLoading={formik.isSubmitting} onClick={formik.submitForm}>
              Create new account
            </Button>
          </ModalFooter>
        )}
        onSubmit={onSubmit}
      />
    </ModalContent>
  );
}

type CreateAccountModalProps = Omit<ModalProps, 'children'> &
  CreateAccountModalContentProps;

function CreateAccountModal(props: CreateAccountModalProps) {
  const { account, onSuccess, ...otherProps } = props;

  return (
    <Modal {...otherProps}>
      <ModalOverlay />
      <CreateAccountModalContent account={account} onSuccess={onSuccess} />
    </Modal>
  );
}

export default CreateAccountModal;

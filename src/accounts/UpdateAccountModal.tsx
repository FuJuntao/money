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
import type { AccountType, AccountWithID } from '../database/accounts/types';
import { updateAccount } from '../database/accounts/updateAccount';
import { useMutation } from '../hooks/useMutation';
import AccountEditForm, { Values } from './AccountEditForm';

interface UpdateAccountModalContentProps {
  account: AccountWithID;
  onSuccess?: (account: AccountWithID) => void;
}

function UpdateAccountModalContent(props: UpdateAccountModalContentProps) {
  const toast = useToast();
  const { account, onSuccess } = props;

  const { mutate } = useMutation(updateAccount);

  const onSubmit = async ({ name, type }: Values) => {
    const result = await mutate({
      id: account.id,
      name,
      type: type as AccountType,
    });
    if (result) {
      toast({
        title: `Account '${result.name}' successfully updated`,
        status: 'success',
        isClosable: true,
      });
      if (onSuccess) onSuccess(result);
    }
  };

  return (
    <ModalContent>
      <ModalHeader>Update Account</ModalHeader>
      <ModalCloseButton />

      <AccountEditForm
        initialValues={account}
        renderActions={(formik) => (
          <ModalFooter>
            <Button type="submit" isLoading={formik.isSubmitting}>
              Update
            </Button>
          </ModalFooter>
        )}
        onSubmit={onSubmit}
      />
    </ModalContent>
  );
}

type UpdateAccountModalProps = Omit<ModalProps, 'children'> &
  UpdateAccountModalContentProps;

function UpdateAccountModal(props: UpdateAccountModalProps) {
  const { account, onSuccess, ...otherProps } = props;

  return (
    <Modal {...otherProps}>
      <ModalOverlay />
      <UpdateAccountModalContent account={account} onSuccess={onSuccess} />
    </Modal>
  );
}

export default UpdateAccountModal;

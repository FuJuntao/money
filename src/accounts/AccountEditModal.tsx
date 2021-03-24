import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import type { Account } from 'src/graphql-schemas/generatedTypes';
import { useMutation } from '../hooks/useMutation';

interface CreateAccountMutationResult {
  createAccount: Account;
}

interface CreateAccountMutationVariables {
  input: { name: string };
}

interface AccountEditModalContentProps {
  account?: { id?: number; name: string };
  onSuccess?: (account: Account) => void;
}

const createAccountMutation = `
mutation CreatAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
    id
    name
  }
}
`;

function AccountEditModalContent(props: AccountEditModalContentProps) {
  const toast = useToast();
  const { account, onSuccess } = props;
  const isCreating = account?.id === undefined;
  const [name, setName] = useState('');

  const { mutate, isLoading } = useMutation<
    CreateAccountMutationResult,
    CreateAccountMutationVariables
  >(createAccountMutation);

  const createAccount = async () => {
    const { data, errors } = await mutate({ input: { name } });
    if (errors) {
      throw errors;
    }
    if (data?.createAccount) {
      toast({
        title: `Account '${data.createAccount.name}' successfully created`,
        status: 'success',
        isClosable: true,
      });
      return data.createAccount;
    }
  };

  const handleSubmit = async () => {
    let result;
    if (isCreating) {
      result = await createAccount();
    }
    if (result && onSuccess) onSuccess(result);
  };

  return (
    <ModalContent>
      <ModalHeader>New Account</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Input
          placeholder="Account name"
          value={name}
          onChange={({ target: { value } }) => setName(value)}
        />
      </ModalBody>

      <ModalFooter>
        <Button isLoading={isLoading} onClick={handleSubmit}>
          Create new account
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

type AccountEditModalProps = Omit<ModalProps, 'children'> &
  AccountEditModalContentProps;

function AccountEditModal(props: AccountEditModalProps) {
  const { onSuccess, ...otherProps } = props;

  return (
    <Modal {...otherProps}>
      <ModalOverlay />
      <AccountEditModalContent onSuccess={onSuccess} />
    </Modal>
  );
}

export default AccountEditModal;

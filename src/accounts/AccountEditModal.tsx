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

const createAccountMutation = `
mutation CreateAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
    id
    name
  }
}
`;

interface UpdateAccountMutationResult {
  updateAccount: Account;
}

interface UpdateAccountMutationVariables {
  input: Account;
}

const updateAccountMutation = `
mutation UpdateAccount($input: UpdateAccountInput!) {
  updateAccount(input: $input) {
    id
    name
  }
}
`;

interface AccountEditModalContentProps {
  account?: { id?: number; name: string };
  onSuccess?: (account: Account) => void;
}

function isUpdatingAccount(
  account?: AccountEditModalContentProps['account'],
): account is Account {
  return account?.id !== undefined;
}

function AccountEditModalContent(props: AccountEditModalContentProps) {
  const toast = useToast();
  const { account, onSuccess } = props;
  const isUpdating = isUpdatingAccount(account);
  const [name, setName] = useState(account?.name ?? '');

  const createAccountMutationResult = useMutation<
    CreateAccountMutationResult,
    CreateAccountMutationVariables
  >(createAccountMutation);

  const updateAccountMutationResult = useMutation<
    UpdateAccountMutationResult,
    UpdateAccountMutationVariables
  >(updateAccountMutation);

  const createAccount = async (name: string) => {
    const { data, errors } = await createAccountMutationResult.mutate({
      input: { name },
    });
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

  const updateAccount = async (account: Account) => {
    const { data, errors } = await updateAccountMutationResult.mutate({
      input: account,
    });
    console.log(
      'file: AccountEditModal.tsx ~ line 100 ~ updateAccount ~ data',
      data,
    );
    if (errors) {
      throw errors;
    }
    if (data?.updateAccount) {
      toast({
        title: `Account '${data.updateAccount.name}' successfully updated`,
        status: 'success',
        isClosable: true,
      });
      return data.updateAccount;
    }
  };

  const handleSubmit = async () => {
    let result;
    if (isUpdatingAccount(account)) {
      result = await updateAccount({ id: account.id, name });
    } else {
      result = await createAccount(name);
    }
    if (result && onSuccess) onSuccess(result);
  };

  const buttonIsLoading =
    createAccountMutationResult.isLoading ||
    updateAccountMutationResult.isLoading;

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
        <Button isLoading={buttonIsLoading} onClick={handleSubmit}>
          {isUpdating ? 'Update account' : 'Create new account'}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

type AccountEditModalProps = Omit<ModalProps, 'children'> &
  AccountEditModalContentProps;

function AccountEditModal(props: AccountEditModalProps) {
  const { account, onSuccess, ...otherProps } = props;

  return (
    <Modal {...otherProps}>
      <ModalOverlay />
      <AccountEditModalContent account={account} onSuccess={onSuccess} />
    </Modal>
  );
}

export default AccountEditModal;

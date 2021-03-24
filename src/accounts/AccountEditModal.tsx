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
  Select,
  useToast,
} from '@chakra-ui/react';
import React, { ReactNode, useState } from 'react';
import type { Account, AccountType } from 'src/graphql-schemas/generatedTypes';
import { useMutation } from '../hooks/useMutation';

interface CreateAccountMutationResult {
  createAccount: Account;
}

interface CreateAccountMutationVariables {
  input: { name: string; type: AccountType };
}

const createAccountMutation = `
mutation CreateAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
    id
    name
    type
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
    type
  }
}
`;

interface AccountEditModalContentProps {
  account?: Partial<Account>;
  onSuccess?: (account: Account) => void;
}

function isUpdatingAccount(
  account?: AccountEditModalContentProps['account'],
): account is Account {
  return account?.id !== undefined;
}

const accountTypeOptions: { value: AccountType; children: ReactNode }[] = [
  { value: 'asset', children: 'Asset' },
  { value: 'credit_card', children: 'Credit Card' },
  { value: 'payment_account', children: 'Payment Account' },
];

function AccountEditModalContent(props: AccountEditModalContentProps) {
  const toast = useToast();
  const { account, onSuccess } = props;
  const isUpdating = isUpdatingAccount(account);
  const [name, setName] = useState(account?.name ?? '');
  const [type, setType] = useState<AccountType | ''>(account?.type ?? '');

  const createAccountMutationResult = useMutation<
    CreateAccountMutationResult,
    CreateAccountMutationVariables
  >(createAccountMutation);

  const updateAccountMutationResult = useMutation<
    UpdateAccountMutationResult,
    UpdateAccountMutationVariables
  >(updateAccountMutation);

  const createAccount = async (account: Omit<Account, 'id'>) => {
    const { data, errors } = await createAccountMutationResult.mutate({
      input: account,
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
      result = await updateAccount({
        id: account.id,
        name,
        type: type as AccountType,
      });
    } else {
      result = await createAccount({ name, type: type as AccountType });
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
          onChange={(e) => setName(e.target.value)}
        />
        <Select
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value as AccountType)}
        >
          {accountTypeOptions.map((props) => (
            <option key={props.value} {...props} />
          ))}
        </Select>
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

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
import { createAccount } from '../database/accounts/createAccount';
import type { Account, AccountType } from '../database/accounts/types';
import { updateAccount } from '../database/accounts/updateAccount';
import { useMutation } from '../hooks/useMutation';

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

  const createAccountMutationResult = useMutation(createAccount);
  const updateAccountMutationResult = useMutation(updateAccount);

  const createAccountFn = async (account: Omit<Account, 'id'>) => {
    const result = await createAccountMutationResult.mutate(account);
    if (result) {
      toast({
        title: `Account '${result.name}' successfully created`,
        status: 'success',
        isClosable: true,
      });
      return result;
    }
  };

  const updateAccountFn = async (account: Account) => {
    const result = await updateAccountMutationResult.mutate(account);
    if (result) {
      toast({
        title: `Account '${result.name}' successfully updated`,
        status: 'success',
        isClosable: true,
      });
      return result;
    }
  };

  const handleSubmit = async () => {
    let result;
    if (isUpdatingAccount(account)) {
      result = await updateAccountFn({
        id: account.id,
        name,
        type: type as AccountType,
      });
    } else {
      result = await createAccountFn({ name, type: type as AccountType });
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

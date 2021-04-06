import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Stat,
  StatLabel,
  StatNumber,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Decimal } from 'decimal.js';
import { useLiveQuery } from 'dexie-react-hooks';
import React, { useMemo } from 'react';
import { deleteAccount } from '../database/accounts/deleteAccount';
import type { AccountType, AccountWithID } from '../database/accounts/types';
import { db, ID } from '../database/MoneyDB';
import type { TransactionType } from '../database/transactions/types';
import { useMutation } from '../hooks/useMutation';
import UpdateAccountModal from './UpdateAccountModal';

export const accountTypeTitle: Record<AccountType, string> = {
  asset: 'Asset',
  credit_card: 'Credit Card',
  payment_account: 'Payment Account',
};

interface AccountDeleteIconButtonProps {
  id: ID;
}

function AccountDeleteIconButton(props: AccountDeleteIconButtonProps) {
  const toast = useToast();
  const { id } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate, isLoading } = useMutation(deleteAccount);

  const handleDelete = async () => {
    await mutate({ id });
    toast({
      title: `Account successfully deleted`,
      status: 'success',
      isClosable: true,
    });
  };

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <IconButton
          variant="outline"
          aria-label="Delete account"
          icon={<DeleteIcon />}
        />
      </PopoverTrigger>

      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>Are you sure you want to delete this account?</PopoverBody>
        <PopoverFooter display="flex" justifyContent="space-between">
          <Button isLoading={isLoading} onClick={handleDelete}>
            Yes!
          </Button>
          <Button onClick={onClose}>No!</Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

interface AccountUpdateIconButtonProps {
  account: AccountWithID;
}

function AccountUpdateIconButton(props: AccountUpdateIconButtonProps) {
  const { account } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        variant="outline"
        aria-label="Update account"
        icon={<EditIcon />}
        onClick={() => onOpen()}
      />

      <UpdateAccountModal
        isOpen={isOpen}
        onClose={onClose}
        account={account}
        onSuccess={onClose}
      />
    </>
  );
}

const getAmountWithSign = (amount: number, type: TransactionType) => {
  switch (type) {
    case 'in':
      return amount;
    case 'out':
    case 'transfer':
      return -amount;
    default:
      throw new Error('Unknown transaction type');
  }
};

interface AccountListItemProps {
  account: AccountWithID;
}

export default function AccountListItem(props: AccountListItemProps) {
  const { account } = props;
  const { id, name } = account;
  const transactions = useLiveQuery(() =>
    db.transactions
      .filter(
        ({ accountId, oppositeAccountId }) =>
          accountId === id || oppositeAccountId === id,
      )
      .toArray(),
  );

  const balance = useMemo(
    () =>
      (
        transactions?.reduce(
          (prev, { transactionType, amount, oppositeAccountId }) => {
            const amountWithSign = getAmountWithSign(amount, transactionType);
            return prev.plus(
              oppositeAccountId === id ? -amountWithSign : amountWithSign,
            );
          },
          new Decimal(0),
        ) ?? new Decimal(0)
      ).toNumber(),
    [id, transactions],
  );

  return (
    <Flex alignItems="center">
      <Stat>
        <StatLabel>{name}</StatLabel>
        <StatNumber>{balance}</StatNumber>
      </Stat>

      <ButtonGroup isAttached variant="outline" ml="auto">
        <AccountUpdateIconButton account={account} />
        <AccountDeleteIconButton id={account.id} />
      </ButtonGroup>
    </Flex>
  );
}

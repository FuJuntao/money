import { EditIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import type { Account, AccountType } from '../database/accounts/types';
import UpdateAccountModal from './UpdateAccountModal';

export const accountTypeTitle: Record<AccountType, string> = {
  asset: 'Asset',
  credit_card: 'Credit Card',
  payment_account: 'Payment Account',
};

interface AccountListItemProps {
  account: Account;
}

export default function AccountListItem(props: AccountListItemProps) {
  const { account } = props;
  const { name, type } = account;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Flex alignItems="center">
        <Heading as="h3">{name}</Heading>

        <Badge>{accountTypeTitle[type]}</Badge>

        <IconButton
          variant="ghost"
          aria-label="Update account"
          icon={<EditIcon />}
          onClick={() => onOpen()}
        />
      </Flex>

      <UpdateAccountModal
        isOpen={isOpen}
        onClose={onClose}
        account={account}
        onSuccess={onClose}
      />
    </Box>
  );
}

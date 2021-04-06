import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import type { AccountType } from '../database/accounts/types';
import { db } from '../database/MoneyDB';
import AccountListItem, { accountTypeTitle } from './AccountListItem';
import CreateAccountModal from './CreateAccountModal';

function Accounts(props: { type: AccountType }) {
  const { type } = props;
  const accounts = useLiveQuery(() =>
    db.accounts.where('type').equals(type).toArray(),
  );

  return (
    <Skeleton isLoaded={!!accounts}>
      <Stack>
        {accounts?.map((account) => (
          <AccountListItem key={account.id} account={account} />
        ))}
      </Stack>
    </Skeleton>
  );
}

const accountTypes: AccountType[] = ['payment_account', 'credit_card', 'asset'];

export default function AccountList() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Flex justifyContent="flex-end">
        <IconButton
          aria-label="Create account"
          onClick={onOpen}
          icon={<AddIcon />}
        />
      </Flex>

      <Divider my="4" />

      <Stack spacing={10}>
        {accountTypes.map((type) => (
          <Box key={type}>
            <Heading as="h2">{accountTypeTitle[type]}</Heading>
            <Divider />
            <Accounts type={type} />
          </Box>
        ))}
      </Stack>

      <CreateAccountModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={onClose}
      />
    </Box>
  );
}

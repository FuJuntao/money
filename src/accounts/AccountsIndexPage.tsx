import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  IconButton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import type { AccountType } from '../database/accounts/types';
import AccountList from './AccountList';
import CreateAccountModal from './CreateAccountModal';

const accountTypes: AccountType[] = ['payment_account', 'credit_card', 'asset'];

export default function AccountsIndexPage() {
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
          <AccountList key={type} type={type} />
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

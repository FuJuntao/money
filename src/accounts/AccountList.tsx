import { AddIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import type { Account } from '../database/accounts/types';
import { useGetAccountsAlive } from '../database/accounts/useGetAccountsAlive';
import AccountEditModal from './AccountEditModal';

export default function AccountList() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const accounts = useGetAccountsAlive();

  const [updatingAccount, setUpdatingAccount] = useState<undefined | Account>();

  const handleClickCreateNewAccountButton = () => {
    setUpdatingAccount(undefined);
    onOpen();
  };

  const handleClickUpdateAccountButton = (account: Account) => () => {
    setUpdatingAccount(account);
    onOpen();
  };

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Heading>Accounts</Heading>
        <IconButton
          aria-label="Create account"
          onClick={handleClickCreateNewAccountButton}
          icon={<AddIcon />}
        />
      </Flex>

      <Divider />

      {!accounts ? (
        <Spinner />
      ) : (
        <Stack>
          {accounts.map((account) => (
            <Flex key={account.id}>
              <Heading as="h3">{account.name}</Heading>

              <IconButton
                variant="ghost"
                aria-label="Update account"
                icon={<EditIcon />}
                onClick={handleClickUpdateAccountButton(account)}
              />
            </Flex>
          ))}
        </Stack>
      )}

      <AccountEditModal
        isOpen={isOpen}
        onClose={onClose}
        account={updatingAccount}
        onSuccess={onClose}
      />
    </Box>
  );
}

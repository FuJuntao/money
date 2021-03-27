import { AddIcon, EditIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useLiveQuery } from 'dexie-react-hooks';
import React, { useState } from 'react';
import { getAccounts } from '../database/accounts/getAccounts';
import type { Account } from '../database/accounts/types';
import AccountEditModal, { accountTypeTitle } from './AccountEditModal';

export default function AccountList() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const accounts = useLiveQuery(getAccounts);

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
      <Flex justifyContent="flex-end">
        <IconButton
          aria-label="Create account"
          onClick={handleClickCreateNewAccountButton}
          icon={<AddIcon />}
        />
      </Flex>

      <Divider my="4" />

      {!accounts ? (
        <Spinner />
      ) : (
        <Stack>
          {accounts.map((account) => (
            <Box key={account.id}>
              <Flex alignItems="center">
                <Heading as="h3">{account.name}</Heading>

                <Badge>{accountTypeTitle[account.type]}</Badge>

                <IconButton
                  variant="ghost"
                  aria-label="Update account"
                  icon={<EditIcon />}
                  onClick={handleClickUpdateAccountButton(account)}
                />
              </Flex>
            </Box>
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

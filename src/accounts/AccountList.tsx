import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  IconButton,
  Spinner,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import { getAccounts } from '../database/accounts/getAccounts';
import AccountListItem from './AccountListItem';
import CreateAccountModal from './CreateAccountModal';

export default function AccountList() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const accounts = useLiveQuery(getAccounts);

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

      {!accounts ? (
        <Spinner />
      ) : (
        <Stack>
          {accounts.map((account) => (
            <AccountListItem key={account.id} account={account} />
          ))}
        </Stack>
      )}

      <CreateAccountModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={onClose}
      />
    </Box>
  );
}

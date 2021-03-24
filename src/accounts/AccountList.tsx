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
import type { Account } from 'src/graphql-schemas/generatedTypes';
import { useQuery } from '../hooks/useQuery';
import AccountEditModal from './AccountEditModal';

interface ResultData {
  accounts: Account[];
}

export default function AccountList() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { query, data, isLoading } = useQuery<ResultData>(
    `
      query Accounts {
        accounts {
          id
          name
        }
      }
    `,
  );

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

      {isLoading ? (
        <Spinner />
      ) : (
        <Stack>
          {data?.accounts.map((account) => (
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
        onSuccess={() => {
          query();
          onClose();
        }}
      />
    </Box>
  );
}

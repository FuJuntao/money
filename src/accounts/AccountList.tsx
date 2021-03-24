import { AddIcon } from '@chakra-ui/icons';
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
import React from 'react';
import { useQuery } from '../hooks/useQuery';
import AccountEditModal from './AccountEditModal';

interface ResultData {
  accounts: { id: string; name: string }[];
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

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Heading>Accounts</Heading>
        <IconButton
          aria-label="Create account"
          onClick={onOpen}
          icon={<AddIcon />}
        />
      </Flex>

      <Divider />

      {isLoading ? (
        <Spinner />
      ) : (
        <Stack>
          {data?.accounts.map((account) => (
            <Heading key={account.id} as="h3">
              {account.name}
            </Heading>
          ))}
        </Stack>
      )}

      <AccountEditModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={() => {
          query();
          onClose();
        }}
      />
    </Box>
  );
}

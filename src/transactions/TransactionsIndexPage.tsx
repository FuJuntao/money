import { AddIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Stack, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import type { TransactionType } from '../database/transactions/types';
import AddTransactionModal from './AddTransactionModal';
import TransactionList from './TransactionList';

const transactionTypes: TransactionType[] = ['out', 'in', 'transfer'];

export default function TransactionsIndexPage() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Box>
      <Flex justifyContent="flex-end">
        <IconButton
          aria-label="Create account"
          onClick={onOpen}
          icon={<AddIcon />}
        />
      </Flex>

      <Stack spacing={6}>
        {transactionTypes.map((type) => (
          <TransactionList key={type} type={type} />
        ))}
      </Stack>

      <AddTransactionModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={onClose}
      />
    </Box>
  );
}

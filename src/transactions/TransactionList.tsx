import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  IconButton,
  Spinner,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import { db } from '../database/MoneyDB';
import AddTransactionModal from './AddTransactionModal';

export default function TransactionsList() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const transactions = useLiveQuery(() =>
    db.transactions.orderBy('transactionType').toArray(),
  );

  return (
    <Box>
      <Flex justifyContent="flex-end">
        <IconButton
          aria-label="Create account"
          onClick={onOpen}
          icon={<AddIcon />}
        />
      </Flex>

      {!transactions ? (
        <Spinner />
      ) : (
        <Stack>
          {transactions.map((transaction) => (
            <Box>{transaction.transactionType}</Box>
          ))}
        </Stack>
      )}

      <AddTransactionModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={onClose}
      />
    </Box>
  );
}

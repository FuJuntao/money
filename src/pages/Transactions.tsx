import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  IconButton,
  Skeleton,
  Stack,
  StackDivider,
  useDisclosure,
} from '@chakra-ui/react';
import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import { db } from '../database/MoneyDB';
import AddTransactionModal from '../transactions/AddTransactionModal';
import TransactionListItem from '../transactions/TransactionList';

export default function Transactions() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const transactions = useLiveQuery(() => db.transactions.toArray());

  return (
    <Box>
      <Flex justifyContent="flex-end">
        <IconButton
          aria-label="Create account"
          onClick={onOpen}
          icon={<AddIcon />}
        />
      </Flex>

      <Skeleton isLoaded={!!transactions}>
        <Stack divider={<StackDivider borderColor="gray.200" />}>
          {transactions?.map((transaction) => (
            <TransactionListItem
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </Stack>
      </Skeleton>

      <AddTransactionModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={onClose}
      />
    </Box>
  );
}

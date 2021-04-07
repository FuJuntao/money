import {
  Box,
  Divider,
  Heading,
  Skeleton,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import { db } from '../database/MoneyDB';
import type {
  TransactionType,
  TransactionWithID,
} from '../database/transactions/types';
import { transactionTypeTitle } from './TransactionEditForm';

interface TransactionsListItemProps {
  transaction: TransactionWithID;
}

function TransactionListItem(props: TransactionsListItemProps) {
  const { transaction } = props;
  const { accountId, createdAt, amount, oppositeAccountId } = transaction;
  const accounts = useLiveQuery(() => {
    const ids = [accountId];
    if (oppositeAccountId) ids.push(oppositeAccountId);
    return db.accounts.bulkGet(ids);
  });
  const [account, oppositeAccount] = accounts ?? [];

  return (
    <Box>
      <Stat>
        <Skeleton isLoaded={!!account}>
          <StatLabel>
            {account?.name +
              (oppositeAccount ? ` => ${oppositeAccount.name}` : '')}
          </StatLabel>
        </Skeleton>
        <StatNumber>{amount}</StatNumber>
      </Stat>

      <Text fontSize="sm">
        {dayjs(createdAt).format('YY-MM-DD hh:mm:ss a')}
      </Text>
    </Box>
  );
}

interface TransactionListProps {
  type: TransactionType;
}

export default function TransactionList(props: TransactionListProps) {
  const { type } = props;

  const transactions = useLiveQuery(() =>
    db.transactions.where('transactionType').equals(type).toArray(),
  );

  return (
    <Box>
      <Heading as="h2">{transactionTypeTitle[type]}</Heading>
      <Divider />

      <Skeleton isLoaded={!!transactions}>
        <Stack mt="2" spacing={6}>
          {transactions?.map((transaction) => (
            <TransactionListItem
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </Stack>
      </Skeleton>
    </Box>
  );
}

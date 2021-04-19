import { Box, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import Amount from '../components/Amount';
import { db } from '../database/MoneyDB';
import type { TransactionWithID } from '../database/transactions/types';

interface TransactionsListItemProps {
  transaction: TransactionWithID;
}

export default function TransactionListItem(props: TransactionsListItemProps) {
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
      <Text>
        {account?.name + (oppositeAccount ? ` => ${oppositeAccount.name}` : '')}
      </Text>

      <Amount currency="CNY">{amount}</Amount>

      <Text fontSize="sm">
        {dayjs(createdAt).format('YY-MM-DD hh:mm:ss a')}
      </Text>
    </Box>
  );
}

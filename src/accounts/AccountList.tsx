import { Skeleton, Stack } from '@chakra-ui/react';
import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import { db } from '../database/MoneyDB';
import AccountListItem from './AccountListItem';

export default function AccountList() {
  const accounts = useLiveQuery(() => db.accounts.toArray());

  return (
    <Skeleton isLoaded={!!accounts}>
      <Stack>
        {accounts?.map((account) => (
          <AccountListItem key={account.id} account={account} />
        ))}
      </Stack>
    </Skeleton>
  );
}

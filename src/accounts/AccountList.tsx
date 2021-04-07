import { Box, Divider, Heading, Skeleton, Stack } from '@chakra-ui/react';
import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import type { AccountType } from '../database/accounts/types';
import { db } from '../database/MoneyDB';
import AccountListItem, { accountTypeTitle } from './AccountListItem';

export default function AccountList(props: { type: AccountType }) {
  const { type } = props;
  const accounts = useLiveQuery(() =>
    db.accounts.where('type').equals(type).toArray(),
  );

  return (
    <Box key={type}>
      <Heading as="h2">{accountTypeTitle[type]}</Heading>
      <Divider />

      <Skeleton isLoaded={!!accounts}>
        <Stack>
          {accounts?.map((account) => (
            <AccountListItem key={account.id} account={account} />
          ))}
        </Stack>
      </Skeleton>
    </Box>
  );
}

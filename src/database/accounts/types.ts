import type { Table } from 'dexie';
import type { ID } from '../types';

export type AccountType = 'credit_card' | 'payment_account' | 'asset';

export type Account = {
  id: ID;
  name: string;
  type: AccountType;
};

export type AccountsTable = Table<Account, ID>;

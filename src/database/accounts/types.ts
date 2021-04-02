import type { ID, WithID } from '../MoneyDB';

export type AccountType = 'credit_card' | 'payment_account' | 'asset';

export type Account = {
  id?: ID;
  name: string;
  type: AccountType;
};

export type AccountWithID = WithID<Account>;

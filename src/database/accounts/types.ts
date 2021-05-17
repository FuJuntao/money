import type { ID, WithID } from '../MoneyDB';

export type Account = {
  id?: ID;
  name: string;
};

export type AccountWithID = WithID<Account>;

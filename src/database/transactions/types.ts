import type { ID, WithID } from '../MoneyDB';

export type InOutType = 'in' | 'out';

export type Transaction = {
  accountId: ID;
  amount: number;
  createdAt: Date;
  id?: ID;
  inOutType: InOutType;
  oppositeAccountId?: ID;
  updatedAt: Date;
};

export type TransactionWithID = WithID<Transaction>;

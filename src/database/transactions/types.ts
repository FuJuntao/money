import type { ID, WithID } from '../MoneyDB';

type InOutType = 'in' | 'out';

export type Transaction = {
  accountId: ID;
  amount: number;
  id?: ID;
  inOutType: InOutType;
  oppositeAccountId?: ID;
};

export type TransactionWithID = WithID<Transaction>;

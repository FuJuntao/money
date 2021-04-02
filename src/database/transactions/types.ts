import type { ID, WithID } from '../MoneyDB';

export type TransactionType = 'in' | 'out' | 'transfer';

export type Transaction = {
  accountId: ID;
  amount: number;
  createdAt: Date;
  id?: ID;
  oppositeAccountId?: ID;
  remark: string;
  transactionType: TransactionType;
  updatedAt: Date;
};

export type TransactionWithID = WithID<Transaction>;

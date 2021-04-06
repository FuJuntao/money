import { db, ID } from '../MoneyDB';
import type { TransactionType } from './types';

interface AddTransactionInput {
  accountId: ID;
  amount: number;
  oppositeAccountId?: ID;
  remark: string;
  transactionType: TransactionType;
}

export function addTransaction(input: AddTransactionInput) {
  const {
    accountId,
    amount,
    oppositeAccountId,
    remark,
    transactionType,
  } = input;
  const createdAt = new Date();
  const updatedAt = new Date();

  const transactionTable = db.transactions;

  return transactionTable
    .add({
      accountId,
      amount,
      createdAt,
      oppositeAccountId,
      remark,
      transactionType,
      updatedAt,
    })
    .then(async (id) => transactionTable.where('id').equals(id).first());
}

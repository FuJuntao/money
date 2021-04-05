import { db, ID } from '../MoneyDB';
import type { TransactionType } from './types';

interface AddTransactionInput {
  accountId: ID;
  amount: number;
  remark: string;
  transactionType: TransactionType;
  transferToAccountId?: ID;
}

export function addTransaction(input: AddTransactionInput) {
  const {
    accountId,
    amount,
    transferToAccountId,
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
      transferToAccountId,
      remark,
      transactionType,
      updatedAt,
    })
    .then(async (id) => transactionTable.where('id').equals(id).first());
}

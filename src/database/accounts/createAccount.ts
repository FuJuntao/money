import { db } from '../MoneyDB';
import type { Account } from './types';

export function createAccount({ name, type }: Account) {
  return db.accounts
    .add({ name, type })
    .then(async (accountId) =>
      db.accounts.where('id').equals(accountId).first(),
    );
}

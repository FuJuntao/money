import { db } from '../MoneyDB';
import type { Account } from './types';

export function createAccount({ name }: Account) {
  return db.accounts
    .add({ name })
    .then(async (accountId) =>
      db.accounts.where('id').equals(accountId).first(),
    );
}

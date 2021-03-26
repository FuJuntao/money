import { db } from '../connection';
import type { Account } from './types';

export function createAccount({ name, type }: Omit<Account, 'id'>) {
  const table = db.table<Omit<Account, 'id'>>('accounts');
  return table
    .add({ name, type })
    .then(async (accountId) =>
      db.table<Account, 'id'>('accounts').where('id').equals(accountId).first(),
    );
}

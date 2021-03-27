import { db } from '../connection';
import type { Account } from './types';

type AccountOmitId = Omit<Account, 'id'>;

export function createAccount({ name, type }: AccountOmitId) {
  return db
    .table<AccountOmitId>('accounts')
    .add({ name, type })
    .then(async (accountId) =>
      db.table<Account, 'id'>('accounts').where('id').equals(accountId).first(),
    );
}

import { db } from '../connection';
import type { Account } from './types';

export function updateAccount({ id, name, type }: Account) {
  const table = db.table<Account>('accounts');
  return table
    .update(id, { name, type })
    .then(async () => table.where('id').equals(id).first());
}

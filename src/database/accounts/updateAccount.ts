import { db } from '../MoneyDB';
import type { AccountWithID } from './types';

export function updateAccount({ id, name }: AccountWithID) {
  const table = db.accounts;
  return table
    .update(id, { name })
    .then(() => table.where('id').equals(id).first());
}

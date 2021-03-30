import { db } from '../connection';
import type { ID } from '../types';
import type { Account } from './types';

export function deleteAccount({ id }: { id: ID }) {
  return db.table<Account>('accounts').where('id').equals(id).delete();
}

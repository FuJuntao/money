import { db } from '../connection';
import type { AccountsTable } from './types';

export function getAccounts() {
  const table: AccountsTable = db.table('accounts');
  return table.toArray();
}

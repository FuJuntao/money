import { db } from '../MoneyDB';

export function getAccounts() {
  return db.accounts.toArray();
}

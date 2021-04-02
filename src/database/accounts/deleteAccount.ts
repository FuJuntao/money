import { db, ID } from '../MoneyDB';

export function deleteAccount({ id }: { id: ID }) {
  return db.accounts.where('id').equals(id).delete();
}

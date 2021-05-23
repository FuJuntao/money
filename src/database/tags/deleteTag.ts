import { db, ID } from '../MoneyDB';

export function deleteTag({ id }: { id: ID }) {
  return db.tags.where('id').equals(id).delete();
}

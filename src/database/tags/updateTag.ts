import { db } from '../MoneyDB';
import type { TagWithID } from './types';

export function updateTag({ id, name }: TagWithID) {
  const table = db.tags;
  return table
    .update(id, { name })
    .then(() => table.where('id').equals(id).first());
}

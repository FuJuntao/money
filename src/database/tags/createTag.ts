import { db } from '../MoneyDB';
import type { Tag } from './types';

export function createTag({ name }: Tag) {
  const table = db.tags;
  return table
    .add({ name })
    .then(async (tagId) => table.where('id').equals(tagId).first());
}

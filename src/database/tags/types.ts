import type { ID, WithID } from '../MoneyDB';

export type Tag = {
  id?: ID;
  name: string;
};

export type TagWithID = WithID<Tag>;

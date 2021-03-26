export type Maybe<T> = T | null;

export type ID = number;

export type Transaction = {
  id: ID;
  from: Maybe<ID>;
  to: Maybe<ID>;
  amount: number;
};

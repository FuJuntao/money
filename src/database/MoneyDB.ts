import Dexie, {
  DexieOptions,
  IndexableTypeArrayReadonly,
  PromiseExtended,
  Table,
} from 'dexie';
import type { Account } from './accounts/types';
import type { Tag } from './tags/types';
import type { Transaction } from './transactions/types';

export type ID = number;

export type WithID<T = unknown> = T & { id: ID };

interface TableWithAutoIncrementedID<T = unknown, TKey = ID>
  extends Table<WithID<T>, TKey> {
  add(item: T, key?: TKey): PromiseExtended<TKey>;
  bulkAdd<B extends boolean>(
    items: readonly T[],
    keys: IndexableTypeArrayReadonly,
    options: {
      allKeys: B;
    },
  ): PromiseExtended<B extends true ? TKey[] : TKey>;
  bulkAdd<B extends boolean>(
    items: readonly T[],
    options: {
      allKeys: B;
    },
  ): PromiseExtended<B extends true ? TKey[] : TKey>;
  bulkAdd(
    items: readonly T[],
    keys?: IndexableTypeArrayReadonly,
    options?: {
      allKeys: boolean;
    },
  ): PromiseExtended<TKey>;
}

export class MoneyDB extends Dexie {
  accounts: TableWithAutoIncrementedID<Account, ID>;
  transactions: TableWithAutoIncrementedID<Transaction, ID>;
  tags: TableWithAutoIncrementedID<Tag, ID>;

  constructor(options?: DexieOptions) {
    super('money', options);

    this.version(1).stores({
      accounts: '++id, &name',
      transactions:
        '++id, accountId, amount, createdAt, oppositeAccountId, remark, tagIds, transactionType, updatedAt',
      tags: '++id, &name',
    });

    this.accounts = this.table('accounts') as TableWithAutoIncrementedID<
      Account,
      ID
    >;
    this.transactions = this.table(
      'transactions',
    ) as TableWithAutoIncrementedID<Transaction, ID>;
    this.tags = this.table('tags') as TableWithAutoIncrementedID<Tag, ID>;
  }
}

export const db = new MoneyDB();

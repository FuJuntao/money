import Dexie from 'dexie';

export function initializeDatabase() {
  const db = new Dexie('money');
  db.version(1).stores({
    accounts: '++id, name, type',
    transactions: '++id, amount, from, to',
  });
  return db;
}

export const db = initializeDatabase();

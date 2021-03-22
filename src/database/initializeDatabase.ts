import Dexie from 'dexie';

export async function initializeDatabase() {
  const db = new Dexie('money');
  db.version(1).stores({
    accounts: '++id, name',
    transactions: '++id, amount, from, to',
  });
  return db;
}

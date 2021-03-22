import type Dexie from 'dexie';
import { initializeDatabase } from '../database/initializeDatabase';

export type GraphqlContextType = Dexie;

export async function getContextValue(): Promise<GraphqlContextType> {
  return initializeDatabase();
}

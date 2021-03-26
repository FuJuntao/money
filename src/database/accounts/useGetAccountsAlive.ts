import { useLiveQuery } from 'dexie-react-hooks';
import { getAccounts } from './getAccounts';

export function useGetAccountsAlive() {
  return useLiveQuery(getAccounts);
}

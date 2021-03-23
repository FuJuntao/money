import type {
  Account,
  AddAccountInput,
  Resolvers,
} from 'src/graphql-schemas/generatedTypes';
import type { GraphqlContextType } from './graphqlContext';

export const resolvers: Resolvers<GraphqlContextType> = {
  Query: {
    accounts: async (_parent, _args, context) => {
      return await context.table('accounts').toArray();
    },
    transactions: async (_parent, _args, context) => {
      return await context.table('transactions').toArray();
    },
  },
  Mutation: {
    addAccount: async (_parent, args, context) => {
      const table = context.table<AddAccountInput>('accounts');
      return table
        .add({ name: args.input.name })
        .then(async (accountId) =>
          table.where('id').equals(accountId).first(),
        ) as Promise<Account>;
    },
  },
};

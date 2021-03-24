import type {
  Account,
  CreateAccountInput,
  Resolvers,
  UpdateAccountInput,
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
    createAccount: async (_parent, args, context) => {
      const table = context.table<CreateAccountInput>('accounts');
      return table
        .add({ name: args.input.name })
        .then(async (accountId) =>
          table.where('id').equals(accountId).first(),
        ) as Promise<Account>;
    },
    updateAccount: async (_parent, { input: { id, name } }, context) => {
      const table = context.table<UpdateAccountInput>('accounts');
      return table
        .update(id, { name })
        .then(async () =>
          table.where('id').equals(id).first(),
        ) as Promise<Account>;
    },
  },
};

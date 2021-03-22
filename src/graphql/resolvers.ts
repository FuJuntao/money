import type { Resolvers } from 'src/graphql-schemas/types';
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
};

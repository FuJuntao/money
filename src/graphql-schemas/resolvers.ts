import type { Resolvers } from './generated_graphql_types';
import type { GraphqlContextType } from './types';

export const resolvers: Resolvers<GraphqlContextType> = {
  Query: {
    hello: () => 'hello',
  },
};

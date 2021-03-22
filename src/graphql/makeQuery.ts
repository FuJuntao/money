import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql, GraphQLArgs } from 'graphql';
import rawSchema from '../graphql-schemas/schema.graphql';
import { getContextValue, GraphqlContextType } from './graphqlContext';
import { resolvers } from './resolvers';

const schema = makeExecutableSchema<GraphqlContextType>({
  typeDefs: rawSchema,
  resolvers,
  allowUndefinedInResolve: false,
});

export const makeQuery = async (source: GraphQLArgs['source']) => {
  const contextValue = await getContextValue();

  return graphql({
    schema,
    source,
    contextValue,
  });
};

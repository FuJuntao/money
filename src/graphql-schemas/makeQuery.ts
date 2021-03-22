import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql, GraphQLArgs } from 'graphql';
import { initializeDatabase } from '../database/initializeDatabase';
import { resolvers } from './resolvers';
import rawSchema from './schema.graphql';
import type { GraphqlContextType } from './types';

const schema = makeExecutableSchema<GraphqlContextType>({
  typeDefs: rawSchema,
  resolvers,
  allowUndefinedInResolve: false,
});

async function getContextValue(): Promise<GraphqlContextType> {
  return initializeDatabase();
}

export const makeQuery = async (source: GraphQLArgs['source']) => {
  const contextValue = await getContextValue();

  return graphql({
    schema,
    source,
    contextValue,
  });
};

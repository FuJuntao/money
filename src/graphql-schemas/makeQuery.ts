import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql, GraphQLArgs } from 'graphql';
import { resolvers } from './resolvers';
import rawSchema from './schema.graphql';
import type { GraphqlContextType } from './types';

const schema = makeExecutableSchema<GraphqlContextType>({
  typeDefs: rawSchema,
  resolvers,
  allowUndefinedInResolve: false,
});

export const makeQuery = (source: GraphQLArgs['source']) =>
  graphql({
    schema,
    source,
  });

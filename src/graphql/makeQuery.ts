import { makeExecutableSchema } from '@graphql-tools/schema';
import { ExecutionResult, graphql, GraphQLArgs } from 'graphql';
import rawSchema from '../graphql-schemas/schema.graphql';
import { getContextValue, GraphqlContextType } from './graphqlContext';
import { resolvers } from './resolvers';

const schema = makeExecutableSchema<GraphqlContextType>({
  typeDefs: rawSchema,
  resolvers,
  allowUndefinedInResolve: false,
});

export const makeQuery = async <Result>(source: GraphQLArgs['source']) => {
  const contextValue = await getContextValue();

  return graphql({
    schema,
    source,
    contextValue,
  }) as ExecutionResult<Result>;
};

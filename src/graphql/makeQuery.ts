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

type Args = Pick<GraphQLArgs, 'source' | 'variableValues'>;

export const makeQuery = async <Result>(args: Args) => {
  const contextValue = await getContextValue();

  return graphql({
    schema,
    source: args.source,
    contextValue,
    variableValues: args.variableValues,
  }) as ExecutionResult<Result>;
};

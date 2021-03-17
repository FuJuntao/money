import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql } from 'graphql';
import React, { useEffect, useState } from 'react';
import type { Resolvers } from './graphql-schemas/generated_graphql_types';
import rawSchema from './graphql-schemas/schema.graphql';
import type { GraphqlContextType } from './graphql-schemas/types';

const resolvers: Resolvers<GraphqlContextType> = {
  Query: {
    hello: () => 'hello',
  },
};

const schema = makeExecutableSchema<GraphqlContextType>({
  typeDefs: rawSchema,
  resolvers,
  allowUndefinedInResolve: false,
});

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setCount(count + 1), 1_000);
    return () => clearTimeout(timer);
  }, [count, setCount]);

  useEffect(() => {
    async function query() {
      const result = await graphql({
        schema,
        source: '{ hello }',
      });
      console.log('file: App.tsx ~ line 28 ~ query ~ result', result);
    }

    query();
  }, []);

  return (
    <div>
      <h1>hello</h1>
      <p>
        Page has been open for
        <code>{count}</code>
        seconds.
      </p>
    </div>
  );
}

export default App;
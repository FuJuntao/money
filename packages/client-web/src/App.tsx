import type { Resolvers } from '@money/graphql-schemas/lib/generated_graphql_types';
import { schema } from '@money/graphql-schemas/lib/schema';
import { graphql } from 'graphql';
import React, { useEffect, useState } from 'react';

interface AppProps {}

const rootValue: Resolvers = {
  Query: {
    hello: () => {
      return 'Hello world!';
    },
  },
};

function App({}: AppProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setCount(count + 1), 1_000);
    return () => clearTimeout(timer);
  }, [count, setCount]);

  useEffect(() => {
    async function query() {
      const result = await graphql({
        schema,
        rootValue,
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

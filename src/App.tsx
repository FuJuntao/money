import React, { useEffect } from 'react';
import { makeQuery } from './graphql-schemas/makeQuery';

function App() {
  useEffect(() => {
    async function query() {
      const result = await makeQuery(
        '{ accounts { id name } transactions { id from to amount } }',
      );
      console.log('file: App.tsx ~ line 28 ~ query ~ result', result);
    }

    query();
  }, []);

  return (
    <div>
      <h1>hello</h1>
    </div>
  );
}

export default App;

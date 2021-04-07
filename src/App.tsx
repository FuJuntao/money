import {
  ChakraProvider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import React, { ElementType, ReactNode } from 'react';
import AccountsIndexPage from './accounts/AccountsIndexPage';
import { theme } from './theme';
import TransactionsIndexPage from './transactions/TransactionsIndexPage';

const tabList: { id: string; tab: ReactNode; Content: ElementType }[] = [
  { id: 'transactions', tab: 'Transactions', Content: TransactionsIndexPage },
  { id: 'accounts', tab: 'Accounts', Content: AccountsIndexPage },
];

function Homepage() {
  return (
    <Tabs isLazy h="full" display="flex" flexDirection="column">
      <TabPanels flex="1">
        {tabList.map(({ id, Content }) => (
          <TabPanel key={id}>
            <Content />
          </TabPanel>
        ))}
      </TabPanels>

      <TabList>
        {tabList.map(({ id, tab }) => (
          <Tab key={id}>{tab}</Tab>
        ))}
      </TabList>
    </Tabs>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Homepage />
    </ChakraProvider>
  );
}

export default App;

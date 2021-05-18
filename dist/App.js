import {
  ChakraProvider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "../_snowpack/pkg/@chakra-ui/react.js";
import React from "../_snowpack/pkg/react.js";
import AccountsIndexPage from "./accounts/AccountsIndexPage.js";
import {theme} from "./theme.js";
import TransactionsIndexPage from "./transactions/TransactionsIndexPage.js";
const tabList = [
  {id: "transactions", tab: "Transactions", Content: TransactionsIndexPage},
  {id: "accounts", tab: "Accounts", Content: AccountsIndexPage}
];
function Homepage() {
  return /* @__PURE__ */ React.createElement(Tabs, {
    isLazy: true,
    h: "full",
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(TabPanels, {
    flex: "1",
    overflowY: "auto"
  }, tabList.map(({id, Content}) => /* @__PURE__ */ React.createElement(TabPanel, {
    key: id
  }, /* @__PURE__ */ React.createElement(Content, null)))), /* @__PURE__ */ React.createElement(TabList, null, tabList.map(({id, tab}) => /* @__PURE__ */ React.createElement(Tab, {
    key: id
  }, tab))));
}
function App() {
  return /* @__PURE__ */ React.createElement(ChakraProvider, {
    theme
  }, /* @__PURE__ */ React.createElement(Homepage, null));
}
export default App;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcQXBwLnRzeCJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLE1BQU0sVUFBa0U7QUFBQSxFQUN0RSxDQUFFLElBQUksZ0JBQWdCLEtBQUssZ0JBQWdCLFNBQVM7QUFBQSxFQUNwRCxDQUFFLElBQUksWUFBWSxLQUFLLFlBQVksU0FBUztBQUFBO0FBRzlDLG9CQUFvQjtBQUNsQixTQUNFLG9DQUFDLE1BQUQ7QUFBQSxJQUFNLFFBQU07QUFBQSxJQUFDLEdBQUU7QUFBQSxJQUFPLFNBQVE7QUFBQSxJQUFPLGVBQWM7QUFBQSxLQUNqRCxvQ0FBQyxXQUFEO0FBQUEsSUFBVyxNQUFLO0FBQUEsSUFBSSxXQUFVO0FBQUEsS0FDM0IsUUFBUSxJQUFJLENBQUMsQ0FBRSxJQUFJLGFBQ2xCLG9DQUFDLFVBQUQ7QUFBQSxJQUFVLEtBQUs7QUFBQSxLQUNiLG9DQUFDLFNBQUQsVUFLTixvQ0FBQyxTQUFELE1BQ0csUUFBUSxJQUFJLENBQUMsQ0FBRSxJQUFJLFNBQ2xCLG9DQUFDLEtBQUQ7QUFBQSxJQUFLLEtBQUs7QUFBQSxLQUFLO0FBQUE7QUFPekIsZUFBZTtBQUNiLFNBQ0Usb0NBQUMsZ0JBQUQ7QUFBQSxJQUFnQjtBQUFBLEtBQ2Qsb0NBQUMsVUFBRDtBQUFBO0FBS04sZUFBZTsiLAogICJuYW1lcyI6IFtdCn0K

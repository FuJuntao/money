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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL0FwcC50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFFQSxNQUFNLFVBQWtFO0FBQUEsRUFDdEUsQ0FBRSxJQUFJLGdCQUFnQixLQUFLLGdCQUFnQixTQUFTO0FBQUEsRUFDcEQsQ0FBRSxJQUFJLFlBQVksS0FBSyxZQUFZLFNBQVM7QUFBQTtBQUc5QyxvQkFBb0I7QUFDbEIsU0FDRSxvQ0FBQyxNQUFEO0FBQUEsSUFBTSxRQUFNO0FBQUEsSUFBQyxHQUFFO0FBQUEsSUFBTyxTQUFRO0FBQUEsSUFBTyxlQUFjO0FBQUEsS0FDakQsb0NBQUMsV0FBRDtBQUFBLElBQVcsTUFBSztBQUFBLElBQUksV0FBVTtBQUFBLEtBQzNCLFFBQVEsSUFBSSxDQUFDLENBQUUsSUFBSSxhQUNsQixvQ0FBQyxVQUFEO0FBQUEsSUFBVSxLQUFLO0FBQUEsS0FDYixvQ0FBQyxTQUFELFVBS04sb0NBQUMsU0FBRCxNQUNHLFFBQVEsSUFBSSxDQUFDLENBQUUsSUFBSSxTQUNsQixvQ0FBQyxLQUFEO0FBQUEsSUFBSyxLQUFLO0FBQUEsS0FBSztBQUFBO0FBT3pCLGVBQWU7QUFDYixTQUNFLG9DQUFDLGdCQUFEO0FBQUEsSUFBZ0I7QUFBQSxLQUNkLG9DQUFDLFVBQUQ7QUFBQTtBQUtOLGVBQWU7IiwKICAibmFtZXMiOiBbXQp9Cg==

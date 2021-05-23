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
import TagsIndexPage from "./tags/TagsIndexPage.js";
import {theme} from "./theme.js";
import TransactionsIndexPage from "./transactions/TransactionsIndexPage.js";
const tabList = [
  {id: "transactions", tab: "Transactions", Content: TransactionsIndexPage},
  {id: "accounts", tab: "Accounts", Content: AccountsIndexPage},
  {id: "tags", tab: "Tags", Content: TagsIndexPage}
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL0FwcC50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLE1BQU0sVUFBa0U7QUFBQSxFQUN0RSxDQUFFLElBQUksZ0JBQWdCLEtBQUssZ0JBQWdCLFNBQVM7QUFBQSxFQUNwRCxDQUFFLElBQUksWUFBWSxLQUFLLFlBQVksU0FBUztBQUFBLEVBQzVDLENBQUUsSUFBSSxRQUFRLEtBQUssUUFBUSxTQUFTO0FBQUE7QUFHdEMsb0JBQW9CO0FBQ2xCLFNBQ0Usb0NBQUMsTUFBRDtBQUFBLElBQU0sUUFBTTtBQUFBLElBQUMsR0FBRTtBQUFBLElBQU8sU0FBUTtBQUFBLElBQU8sZUFBYztBQUFBLEtBQ2pELG9DQUFDLFdBQUQ7QUFBQSxJQUFXLE1BQUs7QUFBQSxJQUFJLFdBQVU7QUFBQSxLQUMzQixRQUFRLElBQUksQ0FBQyxDQUFFLElBQUksYUFDbEIsb0NBQUMsVUFBRDtBQUFBLElBQVUsS0FBSztBQUFBLEtBQ2Isb0NBQUMsU0FBRCxVQUtOLG9DQUFDLFNBQUQsTUFDRyxRQUFRLElBQUksQ0FBQyxDQUFFLElBQUksU0FDbEIsb0NBQUMsS0FBRDtBQUFBLElBQUssS0FBSztBQUFBLEtBQUs7QUFBQTtBQU96QixlQUFlO0FBQ2IsU0FDRSxvQ0FBQyxnQkFBRDtBQUFBLElBQWdCO0FBQUEsS0FDZCxvQ0FBQyxVQUFEO0FBQUE7QUFLTixlQUFlOyIsCiAgIm5hbWVzIjogW10KfQo=

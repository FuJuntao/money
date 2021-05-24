import * as __SNOWPACK_ENV__ from '../_snowpack/env.js';

import {ChakraProvider} from "../_snowpack/pkg/@chakra-ui/react.js";
import React from "../_snowpack/pkg/react.js";
import {BrowserRouter, useRoutes} from "../_snowpack/pkg/react-router-dom.js";
import Page404 from "./pages/404.js";
import Settings from "./pages/Settings.js";
import {theme} from "./theme.js";
import TransactionsIndexPage from "./transactions/TransactionsIndexPage.js";
function Providers(props) {
  return /* @__PURE__ */ React.createElement(BrowserRouter, null, /* @__PURE__ */ React.createElement(ChakraProvider, {
    theme
  }, props.children));
}
function Routes() {
  return useRoutes([
    {path: "/", element: /* @__PURE__ */ React.createElement(TransactionsIndexPage, null)},
    {path: "settings/*", element: /* @__PURE__ */ React.createElement(Settings, null)},
    {path: "*", element: /* @__PURE__ */ React.createElement(Page404, null)}
  ], __SNOWPACK_ENV__.SNOWPACK_PUBLIC_BASE_URL);
}
function App() {
  return /* @__PURE__ */ React.createElement(Providers, null, /* @__PURE__ */ React.createElement(Routes, null));
}
export default App;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL0FwcC50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLG1CQUFtQixPQUFnQztBQUNqRCxTQUNFLG9DQUFDLGVBQUQsTUFDRSxvQ0FBQyxnQkFBRDtBQUFBLElBQWdCO0FBQUEsS0FBZSxNQUFNO0FBQUE7QUFLM0Msa0JBQWtCO0FBQ2hCLFNBQU8sVUFDTDtBQUFBLElBQ0UsQ0FBRSxNQUFNLEtBQUssU0FBUyxvQ0FBQyx1QkFBRDtBQUFBLElBQ3RCLENBQUUsTUFBTSxjQUFjLFNBQVMsb0NBQUMsVUFBRDtBQUFBLElBQy9CLENBQUUsTUFBTSxLQUFLLFNBQVMsb0NBQUMsU0FBRDtBQUFBLEtBRXhCLFlBQVksSUFBSTtBQUFBO0FBSXBCLGVBQWU7QUFDYixTQUNFLG9DQUFDLFdBQUQsTUFDRSxvQ0FBQyxRQUFEO0FBQUE7QUFLTixlQUFlOyIsCiAgIm5hbWVzIjogW10KfQo=

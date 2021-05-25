import * as __SNOWPACK_ENV__ from '../_snowpack/env.js';

import {ChakraProvider} from "../_snowpack/pkg/@chakra-ui/react.js";
import React from "../_snowpack/pkg/react.js";
import {BrowserRouter, Route, Routes} from "../_snowpack/pkg/react-router-dom.js";
import Homepage from "./pages/index.js";
import Page404 from "./pages/404.js";
import {theme} from "./theme.js";
function Providers(props) {
  return /* @__PURE__ */ React.createElement(BrowserRouter, null, /* @__PURE__ */ React.createElement(ChakraProvider, {
    theme
  }, props.children));
}
function App() {
  return /* @__PURE__ */ React.createElement(Providers, null, /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, {
    path: `${__SNOWPACK_ENV__.SNOWPACK_PUBLIC_BASE_URL ?? ""}/*`,
    element: /* @__PURE__ */ React.createElement(Homepage, null)
  }), /* @__PURE__ */ React.createElement(Route, {
    path: "*",
    element: /* @__PURE__ */ React.createElement(Page404, null)
  })));
}
export default App;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL0FwcC50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxtQkFBbUIsT0FBZ0M7QUFDakQsU0FDRSxvQ0FBQyxlQUFELE1BQ0Usb0NBQUMsZ0JBQUQ7QUFBQSxJQUFnQjtBQUFBLEtBQWUsTUFBTTtBQUFBO0FBSzNDLGVBQWU7QUFDYixTQUNFLG9DQUFDLFdBQUQsTUFDRSxvQ0FBQyxRQUFELE1BQ0Usb0NBQUMsT0FBRDtBQUFBLElBQ0UsTUFBTSxHQUFHLFlBQVksSUFBSSw0QkFBNEI7QUFBQSxJQUNyRCxTQUFTLG9DQUFDLFVBQUQ7QUFBQSxNQUVYLG9DQUFDLE9BQUQ7QUFBQSxJQUFPLE1BQUs7QUFBQSxJQUFJLFNBQVMsb0NBQUMsU0FBRDtBQUFBO0FBQUE7QUFNakMsZUFBZTsiLAogICJuYW1lcyI6IFtdCn0K

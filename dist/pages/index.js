import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';

import {HamburgerIcon} from "../../_snowpack/pkg/@chakra-ui/icons.js";
import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  StackDivider,
  VStack
} from "../../_snowpack/pkg/@chakra-ui/react.js";
import React from "../../_snowpack/pkg/react.js";
import {Link, Route, Routes, useLocation} from "../../_snowpack/pkg/react-router-dom.js";
import Accounts from "./Accounts.js";
import Tags from "./Tags.js";
import Transactions from "./Transactions.js";
function Breadcrumb() {
  const {pathname} = useLocation();
  const baseUrl = __SNOWPACK_ENV__.SNOWPACK_PUBLIC_BASE_URL;
  const pathnameExcludeBaseUrl = !!baseUrl ? pathname.slice(pathname.indexOf(baseUrl) + (baseUrl?.length ?? 0)) : pathname;
  return /* @__PURE__ */ React.createElement(ChakraBreadcrumb, null, (pathnameExcludeBaseUrl === "/" ? "" : pathnameExcludeBaseUrl).split("/").map((path, index, paths) => /* @__PURE__ */ React.createElement(BreadcrumbItem, {
    key: index
  }, /* @__PURE__ */ React.createElement(BreadcrumbLink, {
    as: Link,
    to: paths.slice(0, index + 1).join("/"),
    isCurrentPage: index === paths.length - 1,
    textTransform: "capitalize"
  }, path === "" ? "home" : path))));
}
const settingsMenuList = [
  {to: "accounts", children: "Accounts"},
  {to: "tags", children: "Tags"}
];
export default function Homepage() {
  const menu = /* @__PURE__ */ React.createElement(Menu, null, /* @__PURE__ */ React.createElement(MenuButton, {
    as: IconButton,
    "aria-label": "Options",
    icon: /* @__PURE__ */ React.createElement(HamburgerIcon, null),
    variant: "outline"
  }), /* @__PURE__ */ React.createElement(MenuList, null, settingsMenuList.map(({to, children}) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: to,
    as: Link,
    to
  }, children))));
  const header = /* @__PURE__ */ React.createElement(Flex, {
    as: "header",
    px: "2",
    pt: "2",
    justifyContent: "space-between",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Breadcrumb, null), menu);
  const routes = /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, {
    path: "/",
    element: /* @__PURE__ */ React.createElement(Transactions, null)
  }), /* @__PURE__ */ React.createElement(Route, {
    path: "accounts",
    element: /* @__PURE__ */ React.createElement(Accounts, null)
  }), /* @__PURE__ */ React.createElement(Route, {
    path: "tags",
    element: /* @__PURE__ */ React.createElement(Tags, null)
  }));
  return /* @__PURE__ */ React.createElement(VStack, {
    h: "full",
    divider: /* @__PURE__ */ React.createElement(StackDivider, {
      borderColor: "gray.200"
    }),
    spacing: 2,
    align: "stretch"
  }, header, routes);
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL3BhZ2VzL2luZGV4LnRzeCJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsc0JBQXNCO0FBQ3BCLFFBQU0sQ0FBRSxZQUFhO0FBQ3JCLFFBQU0sVUFBVSxZQUFZLElBQUk7QUFDaEMsUUFBTSx5QkFBeUIsQ0FBQyxDQUFDLFVBQzdCLFNBQVMsTUFBTSxTQUFTLFFBQVEsV0FBWSxVQUFTLFVBQVUsTUFDL0Q7QUFFSixTQUNFLG9DQUFDLGtCQUFELE1BQ0ksNEJBQTJCLE1BQU0sS0FBSyx3QkFDckMsTUFBTSxLQUNOLElBQUksQ0FBQyxNQUFNLE9BQU8sVUFDakIsb0NBQUMsZ0JBQUQ7QUFBQSxJQUFnQixLQUFLO0FBQUEsS0FDbkIsb0NBQUMsZ0JBQUQ7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLElBQUksTUFBTSxNQUFNLEdBQUcsUUFBUSxHQUFHLEtBQUs7QUFBQSxJQUNuQyxlQUFlLFVBQVUsTUFBTSxTQUFTO0FBQUEsSUFDeEMsZUFBYztBQUFBLEtBRWIsU0FBUyxLQUFLLFNBQVM7QUFBQTtBQVF0QyxNQUFNLG1CQUFtQjtBQUFBLEVBQ3ZCLENBQUUsSUFBSSxZQUFZLFVBQVU7QUFBQSxFQUM1QixDQUFFLElBQUksUUFBUSxVQUFVO0FBQUE7QUFHMUIsbUNBQW1DO0FBQ2pDLFFBQU0sT0FDSixvQ0FBQyxNQUFELE1BQ0Usb0NBQUMsWUFBRDtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osY0FBVztBQUFBLElBQ1gsTUFBTSxvQ0FBQyxlQUFEO0FBQUEsSUFDTixTQUFRO0FBQUEsTUFFVixvQ0FBQyxVQUFELE1BQ0csaUJBQWlCLElBQUksQ0FBQyxDQUFFLElBQUksY0FDM0Isb0NBQUMsVUFBRDtBQUFBLElBQVUsS0FBSztBQUFBLElBQUksSUFBSTtBQUFBLElBQU07QUFBQSxLQUMxQjtBQU9YLFFBQU0sU0FDSixvQ0FBQyxNQUFEO0FBQUEsSUFDRSxJQUFHO0FBQUEsSUFDSCxJQUFHO0FBQUEsSUFDSCxJQUFHO0FBQUEsSUFDSCxnQkFBZTtBQUFBLElBQ2YsWUFBVztBQUFBLEtBRVgsb0NBQUMsWUFBRCxPQUNDO0FBSUwsUUFBTSxTQUNKLG9DQUFDLFFBQUQsTUFDRSxvQ0FBQyxPQUFEO0FBQUEsSUFBTyxNQUFLO0FBQUEsSUFBSSxTQUFTLG9DQUFDLGNBQUQ7QUFBQSxNQUN6QixvQ0FBQyxPQUFEO0FBQUEsSUFBTyxNQUFLO0FBQUEsSUFBVyxTQUFTLG9DQUFDLFVBQUQ7QUFBQSxNQUNoQyxvQ0FBQyxPQUFEO0FBQUEsSUFBTyxNQUFLO0FBQUEsSUFBTyxTQUFTLG9DQUFDLE1BQUQ7QUFBQTtBQUloQyxTQUNFLG9DQUFDLFFBQUQ7QUFBQSxJQUNFLEdBQUU7QUFBQSxJQUNGLFNBQVMsb0NBQUMsY0FBRDtBQUFBLE1BQWMsYUFBWTtBQUFBO0FBQUEsSUFDbkMsU0FBUztBQUFBLElBQ1QsT0FBTTtBQUFBLEtBRUwsUUFDQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

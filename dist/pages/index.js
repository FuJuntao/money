import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';

import {HamburgerIcon} from "../../_snowpack/pkg/@chakra-ui/icons.js";
import {
  Box,
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList
} from "../../_snowpack/pkg/@chakra-ui/react.js";
import React from "../../_snowpack/pkg/react.js";
import {Link, Route, Routes, useLocation} from "../../_snowpack/pkg/react-router-dom.js";
import Accounts from "./Accounts.js";
import Tags from "./Tags.js";
import Transactions from "./Transactions.js";
function Breadcrumb() {
  const {pathname} = useLocation();
  const hasBaseUrl = !!__SNOWPACK_ENV__.SNOWPACK_PUBLIC_BASE_URL;
  const pathnameExcludeBaseUrl = hasBaseUrl ? pathname.slice(pathname.indexOf(__SNOWPACK_ENV__.SNOWPACK_PUBLIC_BASE_URL) + __SNOWPACK_ENV__.SNOWPACK_PUBLIC_BASE_URL?.length) : pathname;
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
  const location = useLocation();
  console.log("file: index.tsx ~ line 46 ~ Homepage ~ location", location);
  return /* @__PURE__ */ React.createElement(Box, null, menu, /* @__PURE__ */ React.createElement(Breadcrumb, null), /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, {
    path: "/",
    element: /* @__PURE__ */ React.createElement(Transactions, null)
  }), /* @__PURE__ */ React.createElement(Route, {
    path: "accounts",
    element: /* @__PURE__ */ React.createElement(Accounts, null)
  }), /* @__PURE__ */ React.createElement(Route, {
    path: "tags",
    element: /* @__PURE__ */ React.createElement(Tags, null)
  })));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL3BhZ2VzL2luZGV4LnRzeCJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxzQkFBc0I7QUFDcEIsUUFBTSxDQUFFLFlBQWE7QUFDckIsUUFBTSxhQUFhLENBQUMsQ0FBQyxZQUFZLElBQUk7QUFDckMsUUFBTSx5QkFBeUIsYUFDM0IsU0FBUyxNQUNQLFNBQVMsUUFBUSxZQUFZLElBQUksNEJBQy9CLFlBQVksSUFBSSwwQkFBMEIsVUFFOUM7QUFFSixTQUNFLG9DQUFDLGtCQUFELE1BQ0ksNEJBQTJCLE1BQU0sS0FBSyx3QkFDckMsTUFBTSxLQUNOLElBQUksQ0FBQyxNQUFNLE9BQU8sVUFDakIsb0NBQUMsZ0JBQUQ7QUFBQSxJQUFnQixLQUFLO0FBQUEsS0FDbkIsb0NBQUMsZ0JBQUQ7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLElBQUksTUFBTSxNQUFNLEdBQUcsUUFBUSxHQUFHLEtBQUs7QUFBQSxJQUNuQyxlQUFlLFVBQVUsTUFBTSxTQUFTO0FBQUEsSUFDeEMsZUFBYztBQUFBLEtBRWIsU0FBUyxLQUFLLFNBQVM7QUFBQTtBQVF0QyxNQUFNLG1CQUFtQjtBQUFBLEVBQ3ZCLENBQUUsSUFBSSxZQUFZLFVBQVU7QUFBQSxFQUM1QixDQUFFLElBQUksUUFBUSxVQUFVO0FBQUE7QUFHMUIsbUNBQW1DO0FBQ2pDLFFBQU0sT0FDSixvQ0FBQyxNQUFELE1BQ0Usb0NBQUMsWUFBRDtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osY0FBVztBQUFBLElBQ1gsTUFBTSxvQ0FBQyxlQUFEO0FBQUEsSUFDTixTQUFRO0FBQUEsTUFFVixvQ0FBQyxVQUFELE1BQ0csaUJBQWlCLElBQUksQ0FBQyxDQUFFLElBQUksY0FDM0Isb0NBQUMsVUFBRDtBQUFBLElBQVUsS0FBSztBQUFBLElBQUksSUFBSTtBQUFBLElBQU07QUFBQSxLQUMxQjtBQU9YLFFBQU0sV0FBVztBQUNqQixVQUFRLElBQUksbURBQW1EO0FBRS9ELFNBQ0Usb0NBQUMsS0FBRCxNQUNHLE1BQ0Qsb0NBQUMsWUFBRCxPQUVBLG9DQUFDLFFBQUQsTUFDRSxvQ0FBQyxPQUFEO0FBQUEsSUFBTyxNQUFLO0FBQUEsSUFBSSxTQUFTLG9DQUFDLGNBQUQ7QUFBQSxNQUN6QixvQ0FBQyxPQUFEO0FBQUEsSUFBTyxNQUFLO0FBQUEsSUFBVyxTQUFTLG9DQUFDLFVBQUQ7QUFBQSxNQUNoQyxvQ0FBQyxPQUFEO0FBQUEsSUFBTyxNQUFLO0FBQUEsSUFBTyxTQUFTLG9DQUFDLE1BQUQ7QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

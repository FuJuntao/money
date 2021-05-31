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
import dayjs from "../../_snowpack/pkg/dayjs.js";
import {exportDB, importInto} from "../../_snowpack/pkg/dexie-export-import.js";
import React from "../../_snowpack/pkg/react.js";
import {Link, Route, Routes, useLocation} from "../../_snowpack/pkg/react-router-dom.js";
import {db} from "../database/MoneyDB.js";
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
function downloadBlob(blob, filename = "") {
  const anchor = document.createElement("a");
  anchor.download = filename;
  anchor.href = URL.createObjectURL(blob);
  anchor.click();
}
const settingsMenuList = [
  {to: "accounts", children: "Accounts"},
  {to: "tags", children: "Tags"}
];
const dbOptionsMenuList = [
  {
    children: /* @__PURE__ */ React.createElement(React.Fragment, null, "Import DB", /* @__PURE__ */ React.createElement("input", {
      style: {display: "none"},
      type: "file",
      onChange: async (e) => {
        const file = e.target.files?.[0];
        if (file) {
          await importInto(db, file);
        }
      }
    })),
    as: "label"
  },
  {
    children: "Export DB",
    onClick: async () => {
      const data = await exportDB(db);
      downloadBlob(data, `moneyDB-v${db.verno}-${dayjs().valueOf()}.json`);
    }
  }
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
  }, children)), dbOptionsMenuList.map((props, index) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: index,
    ...props
  }))));
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL3BhZ2VzL2luZGV4LnRzeCJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsc0JBQXNCO0FBQ3BCLFFBQU0sQ0FBRSxZQUFhO0FBQ3JCLFFBQU0sVUFBVSxZQUFZLElBQUk7QUFDaEMsUUFBTSx5QkFBeUIsQ0FBQyxDQUFDLFVBQzdCLFNBQVMsTUFBTSxTQUFTLFFBQVEsV0FBWSxVQUFTLFVBQVUsTUFDL0Q7QUFFSixTQUNFLG9DQUFDLGtCQUFELE1BQ0ksNEJBQTJCLE1BQU0sS0FBSyx3QkFDckMsTUFBTSxLQUNOLElBQUksQ0FBQyxNQUFNLE9BQU8sVUFDakIsb0NBQUMsZ0JBQUQ7QUFBQSxJQUFnQixLQUFLO0FBQUEsS0FDbkIsb0NBQUMsZ0JBQUQ7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLElBQUksTUFBTSxNQUFNLEdBQUcsUUFBUSxHQUFHLEtBQUs7QUFBQSxJQUNuQyxlQUFlLFVBQVUsTUFBTSxTQUFTO0FBQUEsSUFDeEMsZUFBYztBQUFBLEtBRWIsU0FBUyxLQUFLLFNBQVM7QUFBQTtBQVF0QyxzQkFBc0IsTUFBWSxXQUFtQixJQUFJO0FBQ3ZELFFBQU0sU0FBUyxTQUFTLGNBQWM7QUFDdEMsU0FBTyxXQUFXO0FBQ2xCLFNBQU8sT0FBTyxJQUFJLGdCQUFnQjtBQUNsQyxTQUFPO0FBQUE7QUFHVCxNQUFNLG1CQUFtQjtBQUFBLEVBQ3ZCLENBQUUsSUFBSSxZQUFZLFVBQVU7QUFBQSxFQUM1QixDQUFFLElBQUksUUFBUSxVQUFVO0FBQUE7QUFHMUIsTUFBTSxvQkFBcUM7QUFBQSxFQUN6QztBQUFBLElBQ0UsVUFDRSwwREFBRSxhQUVBLG9DQUFDLFNBQUQ7QUFBQSxNQUNFLE9BQU8sQ0FBRSxTQUFTO0FBQUEsTUFDbEIsTUFBSztBQUFBLE1BQ0wsVUFBVSxPQUFPLE1BQU07QUFDckIsY0FBTSxPQUFPLEVBQUUsT0FBTyxRQUFRO0FBQzlCLFlBQUksTUFBTTtBQUdSLGdCQUFNLFdBQVcsSUFBVztBQUFBO0FBQUE7QUFBQTtBQUFBLElBTXRDLElBQUk7QUFBQTtBQUFBLEVBRU47QUFBQSxJQUNFLFVBQVU7QUFBQSxJQUNWLFNBQVMsWUFBWTtBQUduQixZQUFNLE9BQU8sTUFBTSxTQUFTO0FBQzVCLG1CQUFhLE1BQU0sWUFBWSxHQUFHLFNBQVMsUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUt6RCxtQ0FBbUM7QUFDakMsUUFBTSxPQUNKLG9DQUFDLE1BQUQsTUFDRSxvQ0FBQyxZQUFEO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixjQUFXO0FBQUEsSUFDWCxNQUFNLG9DQUFDLGVBQUQ7QUFBQSxJQUNOLFNBQVE7QUFBQSxNQUVWLG9DQUFDLFVBQUQsTUFDRyxpQkFBaUIsSUFBSSxDQUFDLENBQUUsSUFBSSxjQUMzQixvQ0FBQyxVQUFEO0FBQUEsSUFBVSxLQUFLO0FBQUEsSUFBSSxJQUFJO0FBQUEsSUFBTTtBQUFBLEtBQzFCLFlBR0osa0JBQWtCLElBQUksQ0FBQyxPQUFPLFVBQzdCLG9DQUFDLFVBQUQ7QUFBQSxJQUFVLEtBQUs7QUFBQSxPQUFXO0FBQUE7QUFNbEMsUUFBTSxTQUNKLG9DQUFDLE1BQUQ7QUFBQSxJQUNFLElBQUc7QUFBQSxJQUNILElBQUc7QUFBQSxJQUNILElBQUc7QUFBQSxJQUNILGdCQUFlO0FBQUEsSUFDZixZQUFXO0FBQUEsS0FFWCxvQ0FBQyxZQUFELE9BQ0M7QUFJTCxRQUFNLFNBQ0osb0NBQUMsUUFBRCxNQUNFLG9DQUFDLE9BQUQ7QUFBQSxJQUFPLE1BQUs7QUFBQSxJQUFJLFNBQVMsb0NBQUMsY0FBRDtBQUFBLE1BQ3pCLG9DQUFDLE9BQUQ7QUFBQSxJQUFPLE1BQUs7QUFBQSxJQUFXLFNBQVMsb0NBQUMsVUFBRDtBQUFBLE1BQ2hDLG9DQUFDLE9BQUQ7QUFBQSxJQUFPLE1BQUs7QUFBQSxJQUFPLFNBQVMsb0NBQUMsTUFBRDtBQUFBO0FBSWhDLFNBQ0Usb0NBQUMsUUFBRDtBQUFBLElBQ0UsR0FBRTtBQUFBLElBQ0YsU0FBUyxvQ0FBQyxjQUFEO0FBQUEsTUFBYyxhQUFZO0FBQUE7QUFBQSxJQUNuQyxTQUFTO0FBQUEsSUFDVCxPQUFNO0FBQUEsS0FFTCxRQUNBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==

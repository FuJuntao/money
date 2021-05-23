import {Skeleton, Stack} from "../../_snowpack/pkg/@chakra-ui/react.js";
import {useLiveQuery} from "../../_snowpack/pkg/dexie-react-hooks.js";
import React from "../../_snowpack/pkg/react.js";
import {db} from "../database/MoneyDB.js";
import AccountListItem from "./AccountListItem.js";
export default function AccountList() {
  const accounts = useLiveQuery(() => db.accounts.toArray());
  return /* @__PURE__ */ React.createElement(Skeleton, {
    isLoaded: !!accounts
  }, /* @__PURE__ */ React.createElement(Stack, null, accounts?.map((account) => /* @__PURE__ */ React.createElement(AccountListItem, {
    key: account.id,
    account
  }))));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2FjY291bnRzL0FjY291bnRMaXN0LnRzeCJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxzQ0FBc0M7QUFDcEMsUUFBTSxXQUFXLGFBQWEsTUFBTSxHQUFHLFNBQVM7QUFFaEQsU0FDRSxvQ0FBQyxVQUFEO0FBQUEsSUFBVSxVQUFVLENBQUMsQ0FBQztBQUFBLEtBQ3BCLG9DQUFDLE9BQUQsTUFDRyxVQUFVLElBQUksQ0FBQyxZQUNkLG9DQUFDLGlCQUFEO0FBQUEsSUFBaUIsS0FBSyxRQUFRO0FBQUEsSUFBSTtBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==

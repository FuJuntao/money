import {Box, Divider, Heading, Skeleton, Stack} from "../../_snowpack/pkg/@chakra-ui/react.js";
import {useLiveQuery} from "../../_snowpack/pkg/dexie-react-hooks.js";
import React from "../../_snowpack/pkg/react.js";
import {db} from "../database/MoneyDB.js";
import AccountListItem, {accountTypeTitle} from "./AccountListItem.js";
export default function AccountList(props) {
  const {type} = props;
  const accounts = useLiveQuery(() => db.accounts.where("type").equals(type).toArray());
  return /* @__PURE__ */ React.createElement(Box, {
    key: type
  }, /* @__PURE__ */ React.createElement(Heading, {
    as: "h2"
  }, accountTypeTitle[type]), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(Skeleton, {
    isLoaded: !!accounts
  }, /* @__PURE__ */ React.createElement(Stack, null, accounts?.map((account) => /* @__PURE__ */ React.createElement(AccountListItem, {
    key: account.id,
    account
  })))));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcYWNjb3VudHNcXEFjY291bnRMaXN0LnRzeCJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQSxvQ0FBb0MsT0FBOEI7QUFDaEUsUUFBTSxDQUFFLFFBQVM7QUFDakIsUUFBTSxXQUFXLGFBQWEsTUFDNUIsR0FBRyxTQUFTLE1BQU0sUUFBUSxPQUFPLE1BQU07QUFHekMsU0FDRSxvQ0FBQyxLQUFEO0FBQUEsSUFBSyxLQUFLO0FBQUEsS0FDUixvQ0FBQyxTQUFEO0FBQUEsSUFBUyxJQUFHO0FBQUEsS0FBTSxpQkFBaUIsUUFDbkMsb0NBQUMsU0FBRCxPQUVBLG9DQUFDLFVBQUQ7QUFBQSxJQUFVLFVBQVUsQ0FBQyxDQUFDO0FBQUEsS0FDcEIsb0NBQUMsT0FBRCxNQUNHLFVBQVUsSUFBSSxDQUFDLFlBQ2Qsb0NBQUMsaUJBQUQ7QUFBQSxJQUFpQixLQUFLLFFBQVE7QUFBQSxJQUFJO0FBQUE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K

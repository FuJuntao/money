import {Box, Text} from "../../_snowpack/pkg/@chakra-ui/react.js";
import dayjs from "../../_snowpack/pkg/dayjs.js";
import {useLiveQuery} from "../../_snowpack/pkg/dexie-react-hooks.js";
import React from "../../_snowpack/pkg/react.js";
import Amount from "../components/Amount/index.js";
import {db} from "../database/MoneyDB.js";
export default function TransactionListItem(props) {
  const {transaction} = props;
  const {accountId, createdAt, amount, oppositeAccountId} = transaction;
  const accounts = useLiveQuery(() => {
    const ids = [accountId];
    if (oppositeAccountId)
      ids.push(oppositeAccountId);
    return db.accounts.bulkGet(ids);
  });
  const [account, oppositeAccount] = accounts ?? [];
  return /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Text, null, account?.name + (oppositeAccount ? ` => ${oppositeAccount.name}` : "")), /* @__PURE__ */ React.createElement(Amount, {
    currency: "CNY"
  }, amount), /* @__PURE__ */ React.createElement(Text, {
    fontSize: "sm"
  }, dayjs(createdAt).format("YY-MM-DD hh:mm:ss a")));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcdHJhbnNhY3Rpb25zXFxUcmFuc2FjdGlvbkxpc3QudHN4Il0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT0EsNENBQTRDLE9BQWtDO0FBQzVFLFFBQU0sQ0FBRSxlQUFnQjtBQUN4QixRQUFNLENBQUUsV0FBVyxXQUFXLFFBQVEscUJBQXNCO0FBQzVELFFBQU0sV0FBVyxhQUFhLE1BQU07QUFDbEMsVUFBTSxNQUFNLENBQUM7QUFDYixRQUFJO0FBQW1CLFVBQUksS0FBSztBQUNoQyxXQUFPLEdBQUcsU0FBUyxRQUFRO0FBQUE7QUFFN0IsUUFBTSxDQUFDLFNBQVMsbUJBQW1CLFlBQVk7QUFFL0MsU0FDRSxvQ0FBQyxLQUFELE1BQ0Usb0NBQUMsTUFBRCxNQUNHLFNBQVMsT0FBUSxtQkFBa0IsT0FBTyxnQkFBZ0IsU0FBUyxNQUd0RSxvQ0FBQyxRQUFEO0FBQUEsSUFBUSxVQUFTO0FBQUEsS0FBTyxTQUV4QixvQ0FBQyxNQUFEO0FBQUEsSUFBTSxVQUFTO0FBQUEsS0FDWixNQUFNLFdBQVcsT0FBTztBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

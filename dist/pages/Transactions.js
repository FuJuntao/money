import {AddIcon} from "../../_snowpack/pkg/@chakra-ui/icons.js";
import {
  Box,
  Flex,
  IconButton,
  Skeleton,
  Stack,
  StackDivider,
  useDisclosure
} from "../../_snowpack/pkg/@chakra-ui/react.js";
import {useLiveQuery} from "../../_snowpack/pkg/dexie-react-hooks.js";
import React from "../../_snowpack/pkg/react.js";
import {db} from "../database/MoneyDB.js";
import AddTransactionModal from "../transactions/AddTransactionModal.js";
import TransactionListItem from "../transactions/TransactionList.js";
export default function Transactions() {
  const {isOpen, onClose, onOpen} = useDisclosure();
  const transactions = useLiveQuery(() => db.transactions.toCollection().reverse().sortBy("createdAt"));
  return /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Flex, {
    justifyContent: "flex-end"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    "aria-label": "Create account",
    onClick: onOpen,
    icon: /* @__PURE__ */ React.createElement(AddIcon, null)
  })), /* @__PURE__ */ React.createElement(Skeleton, {
    isLoaded: !!transactions
  }, /* @__PURE__ */ React.createElement(Stack, {
    divider: /* @__PURE__ */ React.createElement(StackDivider, {
      borderColor: "gray.200"
    })
  }, transactions?.map((transaction) => /* @__PURE__ */ React.createElement(TransactionListItem, {
    key: transaction.id,
    transaction
  })))), /* @__PURE__ */ React.createElement(AddTransactionModal, {
    isOpen,
    onClose,
    onSuccess: onClose
  }));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL3BhZ2VzL1RyYW5zYWN0aW9ucy50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSx1Q0FBdUM7QUFDckMsUUFBTSxDQUFFLFFBQVEsU0FBUyxVQUFXO0FBQ3BDLFFBQU0sZUFBZSxhQUFhLE1BQ2hDLEdBQUcsYUFBYSxlQUFlLFVBQVUsT0FBTztBQUdsRCxTQUNFLG9DQUFDLEtBQUQsTUFDRSxvQ0FBQyxNQUFEO0FBQUEsSUFBTSxnQkFBZTtBQUFBLEtBQ25CLG9DQUFDLFlBQUQ7QUFBQSxJQUNFLGNBQVc7QUFBQSxJQUNYLFNBQVM7QUFBQSxJQUNULE1BQU0sb0NBQUMsU0FBRDtBQUFBLE9BSVYsb0NBQUMsVUFBRDtBQUFBLElBQVUsVUFBVSxDQUFDLENBQUM7QUFBQSxLQUNwQixvQ0FBQyxPQUFEO0FBQUEsSUFBTyxTQUFTLG9DQUFDLGNBQUQ7QUFBQSxNQUFjLGFBQVk7QUFBQTtBQUFBLEtBQ3ZDLGNBQWMsSUFBSSxDQUFDLGdCQUNsQixvQ0FBQyxxQkFBRDtBQUFBLElBQ0UsS0FBSyxZQUFZO0FBQUEsSUFDakI7QUFBQSxTQU1SLG9DQUFDLHFCQUFEO0FBQUEsSUFDRTtBQUFBLElBQ0E7QUFBQSxJQUNBLFdBQVc7QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

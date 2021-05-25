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
  const transactions = useLiveQuery(() => db.transactions.toArray());
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL3BhZ2VzL1RyYW5zYWN0aW9ucy50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSx1Q0FBdUM7QUFDckMsUUFBTSxDQUFFLFFBQVEsU0FBUyxVQUFXO0FBQ3BDLFFBQU0sZUFBZSxhQUFhLE1BQU0sR0FBRyxhQUFhO0FBRXhELFNBQ0Usb0NBQUMsS0FBRCxNQUNFLG9DQUFDLE1BQUQ7QUFBQSxJQUFNLGdCQUFlO0FBQUEsS0FDbkIsb0NBQUMsWUFBRDtBQUFBLElBQ0UsY0FBVztBQUFBLElBQ1gsU0FBUztBQUFBLElBQ1QsTUFBTSxvQ0FBQyxTQUFEO0FBQUEsT0FJVixvQ0FBQyxVQUFEO0FBQUEsSUFBVSxVQUFVLENBQUMsQ0FBQztBQUFBLEtBQ3BCLG9DQUFDLE9BQUQ7QUFBQSxJQUFPLFNBQVMsb0NBQUMsY0FBRDtBQUFBLE1BQWMsYUFBWTtBQUFBO0FBQUEsS0FDdkMsY0FBYyxJQUFJLENBQUMsZ0JBQ2xCLG9DQUFDLHFCQUFEO0FBQUEsSUFDRSxLQUFLLFlBQVk7QUFBQSxJQUNqQjtBQUFBLFNBTVIsb0NBQUMscUJBQUQ7QUFBQSxJQUNFO0FBQUEsSUFDQTtBQUFBLElBQ0EsV0FBVztBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==

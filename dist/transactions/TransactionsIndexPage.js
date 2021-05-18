import {AddIcon} from "../../snowpack/pkg/@chakra-ui/icons.js";
import {
  Box,
  Flex,
  IconButton,
  Skeleton,
  Stack,
  StackDivider,
  useDisclosure
} from "../../snowpack/pkg/@chakra-ui/react.js";
import {useLiveQuery} from "../../snowpack/pkg/dexie-react-hooks.js";
import React from "../../snowpack/pkg/react.js";
import {db} from "../database/MoneyDB.js";
import AddTransactionModal from "./AddTransactionModal.js";
import TransactionListItem from "./TransactionList.js";
export default function TransactionsIndexPage() {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcdHJhbnNhY3Rpb25zXFxUcmFuc2FjdGlvbnNJbmRleFBhZ2UudHN4Il0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsZ0RBQWdEO0FBQzlDLFFBQU0sQ0FBRSxRQUFRLFNBQVMsVUFBVztBQUNwQyxRQUFNLGVBQWUsYUFBYSxNQUFNLEdBQUcsYUFBYTtBQUV4RCxTQUNFLG9DQUFDLEtBQUQsTUFDRSxvQ0FBQyxNQUFEO0FBQUEsSUFBTSxnQkFBZTtBQUFBLEtBQ25CLG9DQUFDLFlBQUQ7QUFBQSxJQUNFLGNBQVc7QUFBQSxJQUNYLFNBQVM7QUFBQSxJQUNULE1BQU0sb0NBQUMsU0FBRDtBQUFBLE9BSVYsb0NBQUMsVUFBRDtBQUFBLElBQVUsVUFBVSxDQUFDLENBQUM7QUFBQSxLQUNwQixvQ0FBQyxPQUFEO0FBQUEsSUFBTyxTQUFTLG9DQUFDLGNBQUQ7QUFBQSxNQUFjLGFBQVk7QUFBQTtBQUFBLEtBQ3ZDLGNBQWMsSUFBSSxDQUFDLGdCQUNsQixvQ0FBQyxxQkFBRDtBQUFBLElBQ0UsS0FBSyxZQUFZO0FBQUEsSUFDakI7QUFBQSxTQU1SLG9DQUFDLHFCQUFEO0FBQUEsSUFDRTtBQUFBLElBQ0E7QUFBQSxJQUNBLFdBQVc7QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

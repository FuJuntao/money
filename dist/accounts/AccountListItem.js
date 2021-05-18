import {DeleteIcon, EditIcon} from "../../_snowpack/pkg/@chakra-ui/icons.js";
import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Stat,
  StatLabel,
  StatNumber,
  useDisclosure,
  useToast
} from "../../_snowpack/pkg/@chakra-ui/react.js";
import {Decimal} from "../../_snowpack/pkg/decimaljs.js";
import {useLiveQuery} from "../../_snowpack/pkg/dexie-react-hooks.js";
import React, {useMemo} from "../../_snowpack/pkg/react.js";
import {deleteAccount} from "../database/accounts/deleteAccount.js";
import {db} from "../database/MoneyDB.js";
import {useMutation} from "../hooks/useMutation.js";
import UpdateAccountModal from "./UpdateAccountModal.js";
export const accountTypeTitle = {
  asset: "Asset",
  credit_card: "Credit Card",
  payment_account: "Payment Account"
};
function AccountDeleteIconButton(props) {
  const toast = useToast();
  const {id} = props;
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {mutate, isLoading} = useMutation(deleteAccount);
  const handleDelete = async () => {
    await mutate({id});
    toast({
      title: `Account successfully deleted`,
      status: "success",
      isClosable: true
    });
  };
  return /* @__PURE__ */ React.createElement(Popover, {
    isOpen,
    onOpen,
    onClose
  }, /* @__PURE__ */ React.createElement(PopoverTrigger, null, /* @__PURE__ */ React.createElement(IconButton, {
    variant: "outline",
    "aria-label": "Delete account",
    icon: /* @__PURE__ */ React.createElement(DeleteIcon, null)
  })), /* @__PURE__ */ React.createElement(PopoverContent, null, /* @__PURE__ */ React.createElement(PopoverArrow, null), /* @__PURE__ */ React.createElement(PopoverBody, null, "Are you sure you want to delete this account?"), /* @__PURE__ */ React.createElement(PopoverFooter, {
    display: "flex",
    justifyContent: "space-between"
  }, /* @__PURE__ */ React.createElement(Button, {
    isLoading,
    onClick: handleDelete
  }, "Yes!"), /* @__PURE__ */ React.createElement(Button, {
    onClick: onClose
  }, "No!"))));
}
function AccountUpdateIconButton(props) {
  const {account} = props;
  const {isOpen, onOpen, onClose} = useDisclosure();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IconButton, {
    variant: "outline",
    "aria-label": "Update account",
    icon: /* @__PURE__ */ React.createElement(EditIcon, null),
    onClick: () => onOpen()
  }), /* @__PURE__ */ React.createElement(UpdateAccountModal, {
    isOpen,
    onClose,
    account,
    onSuccess: onClose
  }));
}
const getAmountWithSign = (amount, type) => {
  switch (type) {
    case "in":
      return amount;
    case "out":
    case "transfer":
      return -amount;
    default:
      throw new Error("Unknown transaction type");
  }
};
export default function AccountListItem(props) {
  const {account} = props;
  const {id, name} = account;
  const transactions = useLiveQuery(() => db.transactions.filter(({accountId, oppositeAccountId}) => accountId === id || oppositeAccountId === id).toArray());
  const balance = useMemo(() => (transactions?.reduce((prev, {transactionType, amount, oppositeAccountId}) => {
    const amountWithSign = getAmountWithSign(amount, transactionType);
    return prev.plus(oppositeAccountId === id ? -amountWithSign : amountWithSign);
  }, new Decimal(0)) ?? new Decimal(0)).toNumber(), [id, transactions]);
  return /* @__PURE__ */ React.createElement(Flex, {
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Stat, null, /* @__PURE__ */ React.createElement(StatLabel, null, name), /* @__PURE__ */ React.createElement(StatNumber, null, balance)), /* @__PURE__ */ React.createElement(ButtonGroup, {
    isAttached: true,
    variant: "outline",
    ml: "auto"
  }, /* @__PURE__ */ React.createElement(AccountUpdateIconButton, {
    account
  }), /* @__PURE__ */ React.createElement(AccountDeleteIconButton, {
    id: account.id
  })));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcYWNjb3VudHNcXEFjY291bnRMaXN0SXRlbS50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFpQkE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFTyxhQUFNLG1CQUFnRDtBQUFBLEVBQzNELE9BQU87QUFBQSxFQUNQLGFBQWE7QUFBQSxFQUNiLGlCQUFpQjtBQUFBO0FBT25CLGlDQUFpQyxPQUFxQztBQUNwRSxRQUFNLFFBQVE7QUFDZCxRQUFNLENBQUUsTUFBTztBQUNmLFFBQU0sQ0FBRSxRQUFRLFFBQVEsV0FBWTtBQUNwQyxRQUFNLENBQUUsUUFBUSxhQUFjLFlBQVk7QUFFMUMsUUFBTSxlQUFlLFlBQVk7QUFDL0IsVUFBTSxPQUFPLENBQUU7QUFDZixVQUFNO0FBQUEsTUFDSixPQUFPO0FBQUEsTUFDUCxRQUFRO0FBQUEsTUFDUixZQUFZO0FBQUE7QUFBQTtBQUloQixTQUNFLG9DQUFDLFNBQUQ7QUFBQSxJQUFTO0FBQUEsSUFBZ0I7QUFBQSxJQUFnQjtBQUFBLEtBQ3ZDLG9DQUFDLGdCQUFELE1BQ0Usb0NBQUMsWUFBRDtBQUFBLElBQ0UsU0FBUTtBQUFBLElBQ1IsY0FBVztBQUFBLElBQ1gsTUFBTSxvQ0FBQyxZQUFEO0FBQUEsT0FJVixvQ0FBQyxnQkFBRCxNQUNFLG9DQUFDLGNBQUQsT0FDQSxvQ0FBQyxhQUFELE1BQWEsa0RBQ2Isb0NBQUMsZUFBRDtBQUFBLElBQWUsU0FBUTtBQUFBLElBQU8sZ0JBQWU7QUFBQSxLQUMzQyxvQ0FBQyxRQUFEO0FBQUEsSUFBUTtBQUFBLElBQXNCLFNBQVM7QUFBQSxLQUFjLFNBR3JELG9DQUFDLFFBQUQ7QUFBQSxJQUFRLFNBQVM7QUFBQSxLQUFTO0FBQUE7QUFXcEMsaUNBQWlDLE9BQXFDO0FBQ3BFLFFBQU0sQ0FBRSxXQUFZO0FBQ3BCLFFBQU0sQ0FBRSxRQUFRLFFBQVEsV0FBWTtBQUVwQyxTQUNFLDBEQUNFLG9DQUFDLFlBQUQ7QUFBQSxJQUNFLFNBQVE7QUFBQSxJQUNSLGNBQVc7QUFBQSxJQUNYLE1BQU0sb0NBQUMsVUFBRDtBQUFBLElBQ04sU0FBUyxNQUFNO0FBQUEsTUFHakIsb0NBQUMsb0JBQUQ7QUFBQSxJQUNFO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBLFdBQVc7QUFBQTtBQUFBO0FBTW5CLE1BQU0sb0JBQW9CLENBQUMsUUFBZ0IsU0FBMEI7QUFDbkUsVUFBUTtBQUFBLFNBQ0Q7QUFDSCxhQUFPO0FBQUEsU0FDSjtBQUFBLFNBQ0E7QUFDSCxhQUFPLENBQUM7QUFBQTtBQUVSLFlBQU0sSUFBSSxNQUFNO0FBQUE7QUFBQTtBQVF0Qix3Q0FBd0MsT0FBNkI7QUFDbkUsUUFBTSxDQUFFLFdBQVk7QUFDcEIsUUFBTSxDQUFFLElBQUksUUFBUztBQUNyQixRQUFNLGVBQWUsYUFBYSxNQUNoQyxHQUFHLGFBQ0EsT0FDQyxDQUFDLENBQUUsV0FBVyx1QkFDWixjQUFjLE1BQU0sc0JBQXNCLElBRTdDO0FBR0wsUUFBTSxVQUFVLFFBQ2QsTUFFSSxlQUFjLE9BQ1osQ0FBQyxNQUFNLENBQUUsaUJBQWlCLFFBQVEsdUJBQXdCO0FBQ3hELFVBQU0saUJBQWlCLGtCQUFrQixRQUFRO0FBQ2pELFdBQU8sS0FBSyxLQUNWLHNCQUFzQixLQUFLLENBQUMsaUJBQWlCO0FBQUEsS0FHakQsSUFBSSxRQUFRLE9BQ1QsSUFBSSxRQUFRLElBQ2pCLFlBQ0osQ0FBQyxJQUFJO0FBR1AsU0FDRSxvQ0FBQyxNQUFEO0FBQUEsSUFBTSxZQUFXO0FBQUEsS0FDZixvQ0FBQyxNQUFELE1BQ0Usb0NBQUMsV0FBRCxNQUFZLE9BQ1osb0NBQUMsWUFBRCxNQUFhLFdBR2Ysb0NBQUMsYUFBRDtBQUFBLElBQWEsWUFBVTtBQUFBLElBQUMsU0FBUTtBQUFBLElBQVUsSUFBRztBQUFBLEtBQzNDLG9DQUFDLHlCQUFEO0FBQUEsSUFBeUI7QUFBQSxNQUN6QixvQ0FBQyx5QkFBRDtBQUFBLElBQXlCLElBQUksUUFBUTtBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==

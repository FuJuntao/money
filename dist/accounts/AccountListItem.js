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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2FjY291bnRzL0FjY291bnRMaXN0SXRlbS50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFpQkE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFNQSxpQ0FBaUMsT0FBcUM7QUFDcEUsUUFBTSxRQUFRO0FBQ2QsUUFBTSxDQUFFLE1BQU87QUFDZixRQUFNLENBQUUsUUFBUSxRQUFRLFdBQVk7QUFDcEMsUUFBTSxDQUFFLFFBQVEsYUFBYyxZQUFZO0FBRTFDLFFBQU0sZUFBZSxZQUFZO0FBQy9CLFVBQU0sT0FBTyxDQUFFO0FBQ2YsVUFBTTtBQUFBLE1BQ0osT0FBTztBQUFBLE1BQ1AsUUFBUTtBQUFBLE1BQ1IsWUFBWTtBQUFBO0FBQUE7QUFJaEIsU0FDRSxvQ0FBQyxTQUFEO0FBQUEsSUFBUztBQUFBLElBQWdCO0FBQUEsSUFBZ0I7QUFBQSxLQUN2QyxvQ0FBQyxnQkFBRCxNQUNFLG9DQUFDLFlBQUQ7QUFBQSxJQUNFLFNBQVE7QUFBQSxJQUNSLGNBQVc7QUFBQSxJQUNYLE1BQU0sb0NBQUMsWUFBRDtBQUFBLE9BSVYsb0NBQUMsZ0JBQUQsTUFDRSxvQ0FBQyxjQUFELE9BQ0Esb0NBQUMsYUFBRCxNQUFhLGtEQUNiLG9DQUFDLGVBQUQ7QUFBQSxJQUFlLFNBQVE7QUFBQSxJQUFPLGdCQUFlO0FBQUEsS0FDM0Msb0NBQUMsUUFBRDtBQUFBLElBQVE7QUFBQSxJQUFzQixTQUFTO0FBQUEsS0FBYyxTQUdyRCxvQ0FBQyxRQUFEO0FBQUEsSUFBUSxTQUFTO0FBQUEsS0FBUztBQUFBO0FBV3BDLGlDQUFpQyxPQUFxQztBQUNwRSxRQUFNLENBQUUsV0FBWTtBQUNwQixRQUFNLENBQUUsUUFBUSxRQUFRLFdBQVk7QUFFcEMsU0FDRSwwREFDRSxvQ0FBQyxZQUFEO0FBQUEsSUFDRSxTQUFRO0FBQUEsSUFDUixjQUFXO0FBQUEsSUFDWCxNQUFNLG9DQUFDLFVBQUQ7QUFBQSxJQUNOLFNBQVMsTUFBTTtBQUFBLE1BR2pCLG9DQUFDLG9CQUFEO0FBQUEsSUFDRTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSxXQUFXO0FBQUE7QUFBQTtBQU1uQixNQUFNLG9CQUFvQixDQUFDLFFBQWdCLFNBQTBCO0FBQ25FLFVBQVE7QUFBQSxTQUNEO0FBQ0gsYUFBTztBQUFBLFNBQ0o7QUFBQSxTQUNBO0FBQ0gsYUFBTyxDQUFDO0FBQUE7QUFFUixZQUFNLElBQUksTUFBTTtBQUFBO0FBQUE7QUFRdEIsd0NBQXdDLE9BQTZCO0FBQ25FLFFBQU0sQ0FBRSxXQUFZO0FBQ3BCLFFBQU0sQ0FBRSxJQUFJLFFBQVM7QUFDckIsUUFBTSxlQUFlLGFBQWEsTUFDaEMsR0FBRyxhQUNBLE9BQ0MsQ0FBQyxDQUFFLFdBQVcsdUJBQ1osY0FBYyxNQUFNLHNCQUFzQixJQUU3QztBQUdMLFFBQU0sVUFBVSxRQUNkLE1BRUksZUFBYyxPQUNaLENBQUMsTUFBTSxDQUFFLGlCQUFpQixRQUFRLHVCQUF3QjtBQUN4RCxVQUFNLGlCQUFpQixrQkFBa0IsUUFBUTtBQUNqRCxXQUFPLEtBQUssS0FDVixzQkFBc0IsS0FBSyxDQUFDLGlCQUFpQjtBQUFBLEtBR2pELElBQUksUUFBUSxPQUNULElBQUksUUFBUSxJQUNqQixZQUNKLENBQUMsSUFBSTtBQUdQLFNBQ0Usb0NBQUMsTUFBRDtBQUFBLElBQU0sWUFBVztBQUFBLEtBQ2Ysb0NBQUMsTUFBRCxNQUNFLG9DQUFDLFdBQUQsTUFBWSxPQUNaLG9DQUFDLFlBQUQsTUFBYSxXQUdmLG9DQUFDLGFBQUQ7QUFBQSxJQUFhLFlBQVU7QUFBQSxJQUFDLFNBQVE7QUFBQSxJQUFVLElBQUc7QUFBQSxLQUMzQyxvQ0FBQyx5QkFBRDtBQUFBLElBQXlCO0FBQUEsTUFDekIsb0NBQUMseUJBQUQ7QUFBQSxJQUF5QixJQUFJLFFBQVE7QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

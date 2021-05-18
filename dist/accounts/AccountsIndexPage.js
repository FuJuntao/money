import {AddIcon} from "../../snowpack/pkg/@chakra-ui/icons.js";
import {
  Box,
  Divider,
  Flex,
  IconButton,
  Stack,
  useDisclosure
} from "../../snowpack/pkg/@chakra-ui/react.js";
import React from "../../snowpack/pkg/react.js";
import AccountList from "./AccountList.js";
import CreateAccountModal from "./CreateAccountModal.js";
const accountTypes = ["payment_account", "credit_card", "asset"];
export default function AccountsIndexPage() {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Flex, {
    justifyContent: "flex-end"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    "aria-label": "Create account",
    onClick: onOpen,
    icon: /* @__PURE__ */ React.createElement(AddIcon, null)
  })), /* @__PURE__ */ React.createElement(Divider, {
    my: "4"
  }), /* @__PURE__ */ React.createElement(Stack, {
    spacing: 10
  }, accountTypes.map((type) => /* @__PURE__ */ React.createElement(AccountList, {
    key: type,
    type
  }))), /* @__PURE__ */ React.createElement(CreateAccountModal, {
    isOpen,
    onClose,
    onSuccess: onClose
  }));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcYWNjb3VudHNcXEFjY291bnRzSW5kZXhQYWdlLnRzeCJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFBO0FBRUE7QUFDQTtBQUVBLE1BQU0sZUFBOEIsQ0FBQyxtQkFBbUIsZUFBZTtBQUV2RSw0Q0FBNEM7QUFDMUMsUUFBTSxDQUFFLFFBQVEsUUFBUSxXQUFZO0FBRXBDLFNBQ0Usb0NBQUMsS0FBRCxNQUNFLG9DQUFDLE1BQUQ7QUFBQSxJQUFNLGdCQUFlO0FBQUEsS0FDbkIsb0NBQUMsWUFBRDtBQUFBLElBQ0UsY0FBVztBQUFBLElBQ1gsU0FBUztBQUFBLElBQ1QsTUFBTSxvQ0FBQyxTQUFEO0FBQUEsT0FJVixvQ0FBQyxTQUFEO0FBQUEsSUFBUyxJQUFHO0FBQUEsTUFFWixvQ0FBQyxPQUFEO0FBQUEsSUFBTyxTQUFTO0FBQUEsS0FDYixhQUFhLElBQUksQ0FBQyxTQUNqQixvQ0FBQyxhQUFEO0FBQUEsSUFBYSxLQUFLO0FBQUEsSUFBTTtBQUFBLFFBSTVCLG9DQUFDLG9CQUFEO0FBQUEsSUFDRTtBQUFBLElBQ0E7QUFBQSxJQUNBLFdBQVc7QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

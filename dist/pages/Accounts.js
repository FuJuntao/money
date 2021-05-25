import {AddIcon} from "../../_snowpack/pkg/@chakra-ui/icons.js";
import {
  Box,
  Divider,
  Flex,
  IconButton,
  useDisclosure
} from "../../_snowpack/pkg/@chakra-ui/react.js";
import React from "../../_snowpack/pkg/react.js";
import AccountList from "../accounts/AccountList.js";
import CreateAccountModal from "../accounts/CreateAccountModal.js";
export default function Accounts() {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Flex, {
    justifyContent: "flex-end"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    "aria-label": "Create account",
    onClick: onOpen,
    icon: /* @__PURE__ */ React.createElement(AddIcon, null)
  })), /* @__PURE__ */ React.createElement(Divider, {
    my: "4"
  }), /* @__PURE__ */ React.createElement(AccountList, null), /* @__PURE__ */ React.createElement(CreateAccountModal, {
    isOpen,
    onClose,
    onSuccess: onClose
  }));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL3BhZ2VzL0FjY291bnRzLnRzeCJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFPQTtBQUNBO0FBQ0E7QUFFQSxtQ0FBbUM7QUFDakMsUUFBTSxDQUFFLFFBQVEsUUFBUSxXQUFZO0FBRXBDLFNBQ0Usb0NBQUMsS0FBRCxNQUNFLG9DQUFDLE1BQUQ7QUFBQSxJQUFNLGdCQUFlO0FBQUEsS0FDbkIsb0NBQUMsWUFBRDtBQUFBLElBQ0UsY0FBVztBQUFBLElBQ1gsU0FBUztBQUFBLElBQ1QsTUFBTSxvQ0FBQyxTQUFEO0FBQUEsT0FJVixvQ0FBQyxTQUFEO0FBQUEsSUFBUyxJQUFHO0FBQUEsTUFFWixvQ0FBQyxhQUFELE9BRUEsb0NBQUMsb0JBQUQ7QUFBQSxJQUNFO0FBQUEsSUFDQTtBQUFBLElBQ0EsV0FBVztBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==

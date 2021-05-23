import {AddIcon, HamburgerIcon} from "../../_snowpack/pkg/@chakra-ui/icons.js";
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  StackDivider,
  Text,
  useDisclosure
} from "../../_snowpack/pkg/@chakra-ui/react.js";
import {useLiveQuery} from "../../_snowpack/pkg/dexie-react-hooks.js";
import React from "../../_snowpack/pkg/react.js";
import {db} from "../database/MoneyDB.js";
import CreateTagModal from "./CreateTagModal.js";
export default function TagsIndexPage() {
  const tags = useLiveQuery(() => db.tags.toArray());
  const {isOpen, onOpen, onClose} = useDisclosure();
  return /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Menu, null, /* @__PURE__ */ React.createElement(MenuButton, {
    as: IconButton,
    "aria-label": "Options",
    icon: /* @__PURE__ */ React.createElement(HamburgerIcon, null),
    variant: "outline"
  }), /* @__PURE__ */ React.createElement(MenuList, null, /* @__PURE__ */ React.createElement(MenuItem, {
    icon: /* @__PURE__ */ React.createElement(AddIcon, null),
    onClick: onOpen
  }, "New Tag"))), /* @__PURE__ */ React.createElement(CreateTagModal, {
    isOpen,
    onClose,
    onSuccess: onClose
  }), /* @__PURE__ */ React.createElement(Skeleton, {
    isLoaded: !!tags
  }, /* @__PURE__ */ React.createElement(Stack, {
    divider: /* @__PURE__ */ React.createElement(StackDivider, {
      borderColor: "gray.200"
    })
  }, tags?.map((tag) => /* @__PURE__ */ React.createElement(Text, null, tag.name)))));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL3RhZ3MvVGFnc0luZGV4UGFnZS50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFFQSx3Q0FBd0M7QUFDdEMsUUFBTSxPQUFPLGFBQWEsTUFBTSxHQUFHLEtBQUs7QUFDeEMsUUFBTSxDQUFFLFFBQVEsUUFBUSxXQUFZO0FBRXBDLFNBQ0Usb0NBQUMsS0FBRCxNQUNFLG9DQUFDLE1BQUQsTUFDRSxvQ0FBQyxZQUFEO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixjQUFXO0FBQUEsSUFDWCxNQUFNLG9DQUFDLGVBQUQ7QUFBQSxJQUNOLFNBQVE7QUFBQSxNQUVWLG9DQUFDLFVBQUQsTUFDRSxvQ0FBQyxVQUFEO0FBQUEsSUFBVSxNQUFNLG9DQUFDLFNBQUQ7QUFBQSxJQUFhLFNBQVM7QUFBQSxLQUFRLGNBTWxELG9DQUFDLGdCQUFEO0FBQUEsSUFBZ0I7QUFBQSxJQUFnQjtBQUFBLElBQWtCLFdBQVc7QUFBQSxNQUU3RCxvQ0FBQyxVQUFEO0FBQUEsSUFBVSxVQUFVLENBQUMsQ0FBQztBQUFBLEtBQ3BCLG9DQUFDLE9BQUQ7QUFBQSxJQUFPLFNBQVMsb0NBQUMsY0FBRDtBQUFBLE1BQWMsYUFBWTtBQUFBO0FBQUEsS0FDdkMsTUFBTSxJQUFJLENBQUMsUUFDVixvQ0FBQyxNQUFELE1BQU8sSUFBSTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

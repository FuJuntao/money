import {AddIcon, HamburgerIcon} from "../../../_snowpack/pkg/@chakra-ui/icons.js";
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
} from "../../../_snowpack/pkg/@chakra-ui/react.js";
import {useLiveQuery} from "../../../_snowpack/pkg/dexie-react-hooks.js";
import React from "../../../_snowpack/pkg/react.js";
import {db} from "../../database/MoneyDB.js";
import CreateTagModal from "../../tags/CreateTagModal.js";
export default function Tags() {
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
  }, tags?.map(({id, name}) => /* @__PURE__ */ React.createElement(Text, {
    key: id
  }, name)))));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL3BhZ2VzL3NldHRpbmdzL1RhZ3MudHN4Il0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWFBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsK0JBQStCO0FBQzdCLFFBQU0sT0FBTyxhQUFhLE1BQU0sR0FBRyxLQUFLO0FBQ3hDLFFBQU0sQ0FBRSxRQUFRLFFBQVEsV0FBWTtBQUVwQyxTQUNFLG9DQUFDLEtBQUQsTUFDRSxvQ0FBQyxNQUFELE1BQ0Usb0NBQUMsWUFBRDtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osY0FBVztBQUFBLElBQ1gsTUFBTSxvQ0FBQyxlQUFEO0FBQUEsSUFDTixTQUFRO0FBQUEsTUFFVixvQ0FBQyxVQUFELE1BQ0Usb0NBQUMsVUFBRDtBQUFBLElBQVUsTUFBTSxvQ0FBQyxTQUFEO0FBQUEsSUFBYSxTQUFTO0FBQUEsS0FBUSxjQU1sRCxvQ0FBQyxnQkFBRDtBQUFBLElBQWdCO0FBQUEsSUFBZ0I7QUFBQSxJQUFrQixXQUFXO0FBQUEsTUFFN0Qsb0NBQUMsVUFBRDtBQUFBLElBQVUsVUFBVSxDQUFDLENBQUM7QUFBQSxLQUNwQixvQ0FBQyxPQUFEO0FBQUEsSUFBTyxTQUFTLG9DQUFDLGNBQUQ7QUFBQSxNQUFjLGFBQVk7QUFBQTtBQUFBLEtBQ3ZDLE1BQU0sSUFBSSxDQUFDLENBQUUsSUFBSSxVQUNoQixvQ0FBQyxNQUFEO0FBQUEsSUFBTSxLQUFLO0FBQUEsS0FBSztBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

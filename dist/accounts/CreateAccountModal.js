import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast
} from "../../_snowpack/pkg/@chakra-ui/react.js";
import Dexie from "../../_snowpack/pkg/dexie.js";
import React from "../../_snowpack/pkg/react.js";
import {createAccount} from "../database/accounts/createAccount.js";
import {useMutation} from "../hooks/useMutation.js";
import AccountEditForm from "./AccountEditForm.js";
function CreateAccountModalContent(props) {
  const toast = useToast();
  const {account, onSuccess} = props;
  const {mutate} = useMutation(createAccount);
  const onSubmit = async ({name}) => {
    try {
      const result = await mutate({name});
      if (result) {
        toast({
          title: `Account '${result.name}' successfully created`,
          status: "success",
          isClosable: true
        });
        if (onSuccess)
          onSuccess(result);
      }
    } catch (err) {
      if (err instanceof Dexie.DexieError)
        toast({title: err.message, status: "error", isClosable: true});
    }
  };
  return /* @__PURE__ */ React.createElement(ModalContent, null, /* @__PURE__ */ React.createElement(ModalHeader, null, "New Account"), /* @__PURE__ */ React.createElement(ModalCloseButton, null), /* @__PURE__ */ React.createElement(AccountEditForm, {
    initialValues: account,
    renderActions: (formik) => /* @__PURE__ */ React.createElement(ModalFooter, null, /* @__PURE__ */ React.createElement(Button, {
      type: "submit",
      isLoading: formik.isSubmitting
    }, "Create new account")),
    onSubmit
  }));
}
function CreateAccountModal(props) {
  const {account, onSuccess, ...otherProps} = props;
  return /* @__PURE__ */ React.createElement(Modal, {
    ...otherProps
  }, /* @__PURE__ */ React.createElement(ModalOverlay, null), /* @__PURE__ */ React.createElement(CreateAccountModalContent, {
    account,
    onSuccess
  }));
}
export default CreateAccountModal;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2FjY291bnRzL0NyZWF0ZUFjY291bnRNb2RhbC50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVdBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFPQSxtQ0FBbUMsT0FBdUM7QUFDeEUsUUFBTSxRQUFRO0FBQ2QsUUFBTSxDQUFFLFNBQVMsYUFBYztBQUUvQixRQUFNLENBQUUsVUFBVyxZQUFZO0FBRS9CLFFBQU0sV0FBVyxPQUFPLENBQUUsVUFBbUI7QUFDM0MsUUFBSTtBQUNGLFlBQU0sU0FBUyxNQUFNLE9BQU8sQ0FBRTtBQUM5QixVQUFJLFFBQVE7QUFDVixjQUFNO0FBQUEsVUFDSixPQUFPLFlBQVksT0FBTztBQUFBLFVBQzFCLFFBQVE7QUFBQSxVQUNSLFlBQVk7QUFBQTtBQUVkLFlBQUk7QUFBVyxvQkFBVTtBQUFBO0FBQUEsYUFFcEIsS0FBUDtBQUNBLFVBQUksZUFBZSxNQUFNO0FBQ3ZCLGNBQU0sQ0FBRSxPQUFPLElBQUksU0FBUyxRQUFRLFNBQVMsWUFBWTtBQUFBO0FBQUE7QUFJL0QsU0FDRSxvQ0FBQyxjQUFELE1BQ0Usb0NBQUMsYUFBRCxNQUFhLGdCQUNiLG9DQUFDLGtCQUFELE9BRUEsb0NBQUMsaUJBQUQ7QUFBQSxJQUNFLGVBQWU7QUFBQSxJQUNmLGVBQWUsQ0FBQyxXQUNkLG9DQUFDLGFBQUQsTUFDRSxvQ0FBQyxRQUFEO0FBQUEsTUFBUSxNQUFLO0FBQUEsTUFBUyxXQUFXLE9BQU87QUFBQSxPQUFjO0FBQUEsSUFLMUQ7QUFBQTtBQUFBO0FBU1IsNEJBQTRCLE9BQWdDO0FBQzFELFFBQU0sQ0FBRSxTQUFTLGNBQWMsY0FBZTtBQUU5QyxTQUNFLG9DQUFDLE9BQUQ7QUFBQSxPQUFXO0FBQUEsS0FDVCxvQ0FBQyxjQUFELE9BQ0Esb0NBQUMsMkJBQUQ7QUFBQSxJQUEyQjtBQUFBLElBQWtCO0FBQUE7QUFBQTtBQUtuRCxlQUFlOyIsCiAgIm5hbWVzIjogW10KfQo=

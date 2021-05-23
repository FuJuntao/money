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
import React from "../../_snowpack/pkg/react.js";
import {updateAccount} from "../database/accounts/updateAccount.js";
import {useMutation} from "../hooks/useMutation.js";
import AccountEditForm from "./AccountEditForm.js";
function UpdateAccountModalContent(props) {
  const toast = useToast();
  const {account, onSuccess} = props;
  const {mutate} = useMutation(updateAccount);
  const onSubmit = async ({name}) => {
    const result = await mutate({id: account.id, name});
    if (result) {
      toast({
        title: `Account '${result.name}' successfully updated`,
        status: "success",
        isClosable: true
      });
      if (onSuccess)
        onSuccess(result);
    }
  };
  return /* @__PURE__ */ React.createElement(ModalContent, null, /* @__PURE__ */ React.createElement(ModalHeader, null, "Update Account"), /* @__PURE__ */ React.createElement(ModalCloseButton, null), /* @__PURE__ */ React.createElement(AccountEditForm, {
    initialValues: account,
    renderActions: (formik) => /* @__PURE__ */ React.createElement(ModalFooter, null, /* @__PURE__ */ React.createElement(Button, {
      type: "submit",
      isLoading: formik.isSubmitting
    }, "Update")),
    onSubmit
  }));
}
function UpdateAccountModal(props) {
  const {account, onSuccess, ...otherProps} = props;
  return /* @__PURE__ */ React.createElement(Modal, {
    ...otherProps
  }, /* @__PURE__ */ React.createElement(ModalOverlay, null), /* @__PURE__ */ React.createElement(UpdateAccountModalContent, {
    account,
    onSuccess
  }));
}
export default UpdateAccountModal;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2FjY291bnRzL1VwZGF0ZUFjY291bnRNb2RhbC50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVdBO0FBRUE7QUFDQTtBQUNBO0FBT0EsbUNBQW1DLE9BQXVDO0FBQ3hFLFFBQU0sUUFBUTtBQUNkLFFBQU0sQ0FBRSxTQUFTLGFBQWM7QUFFL0IsUUFBTSxDQUFFLFVBQVcsWUFBWTtBQUUvQixRQUFNLFdBQVcsT0FBTyxDQUFFLFVBQW1CO0FBQzNDLFVBQU0sU0FBUyxNQUFNLE9BQU8sQ0FBRSxJQUFJLFFBQVEsSUFBSTtBQUM5QyxRQUFJLFFBQVE7QUFDVixZQUFNO0FBQUEsUUFDSixPQUFPLFlBQVksT0FBTztBQUFBLFFBQzFCLFFBQVE7QUFBQSxRQUNSLFlBQVk7QUFBQTtBQUVkLFVBQUk7QUFBVyxrQkFBVTtBQUFBO0FBQUE7QUFJN0IsU0FDRSxvQ0FBQyxjQUFELE1BQ0Usb0NBQUMsYUFBRCxNQUFhLG1CQUNiLG9DQUFDLGtCQUFELE9BRUEsb0NBQUMsaUJBQUQ7QUFBQSxJQUNFLGVBQWU7QUFBQSxJQUNmLGVBQWUsQ0FBQyxXQUNkLG9DQUFDLGFBQUQsTUFDRSxvQ0FBQyxRQUFEO0FBQUEsTUFBUSxNQUFLO0FBQUEsTUFBUyxXQUFXLE9BQU87QUFBQSxPQUFjO0FBQUEsSUFLMUQ7QUFBQTtBQUFBO0FBU1IsNEJBQTRCLE9BQWdDO0FBQzFELFFBQU0sQ0FBRSxTQUFTLGNBQWMsY0FBZTtBQUU5QyxTQUNFLG9DQUFDLE9BQUQ7QUFBQSxPQUFXO0FBQUEsS0FDVCxvQ0FBQyxjQUFELE9BQ0Esb0NBQUMsMkJBQUQ7QUFBQSxJQUEyQjtBQUFBLElBQWtCO0FBQUE7QUFBQTtBQUtuRCxlQUFlOyIsCiAgIm5hbWVzIjogW10KfQo=

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
  const onSubmit = async ({name, type}) => {
    try {
      const result = await mutate({name, type});
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcYWNjb3VudHNcXENyZWF0ZUFjY291bnRNb2RhbC50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVdBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFPQSxtQ0FBbUMsT0FBdUM7QUFDeEUsUUFBTSxRQUFRO0FBQ2QsUUFBTSxDQUFFLFNBQVMsYUFBYztBQUUvQixRQUFNLENBQUUsVUFBVyxZQUFZO0FBRS9CLFFBQU0sV0FBVyxPQUFPLENBQUUsTUFBTSxVQUFtQjtBQUNqRCxRQUFJO0FBQ0YsWUFBTSxTQUFTLE1BQU0sT0FBTyxDQUFFLE1BQU07QUFDcEMsVUFBSSxRQUFRO0FBQ1YsY0FBTTtBQUFBLFVBQ0osT0FBTyxZQUFZLE9BQU87QUFBQSxVQUMxQixRQUFRO0FBQUEsVUFDUixZQUFZO0FBQUE7QUFFZCxZQUFJO0FBQVcsb0JBQVU7QUFBQTtBQUFBLGFBRXBCLEtBQVA7QUFDQSxVQUFJLGVBQWUsTUFBTTtBQUN2QixjQUFNLENBQUUsT0FBTyxJQUFJLFNBQVMsUUFBUSxTQUFTLFlBQVk7QUFBQTtBQUFBO0FBSS9ELFNBQ0Usb0NBQUMsY0FBRCxNQUNFLG9DQUFDLGFBQUQsTUFBYSxnQkFDYixvQ0FBQyxrQkFBRCxPQUVBLG9DQUFDLGlCQUFEO0FBQUEsSUFDRSxlQUFlO0FBQUEsSUFDZixlQUFlLENBQUMsV0FDZCxvQ0FBQyxhQUFELE1BQ0Usb0NBQUMsUUFBRDtBQUFBLE1BQVEsTUFBSztBQUFBLE1BQVMsV0FBVyxPQUFPO0FBQUEsT0FBYztBQUFBLElBSzFEO0FBQUE7QUFBQTtBQVNSLDRCQUE0QixPQUFnQztBQUMxRCxRQUFNLENBQUUsU0FBUyxjQUFjLGNBQWU7QUFFOUMsU0FDRSxvQ0FBQyxPQUFEO0FBQUEsT0FBVztBQUFBLEtBQ1Qsb0NBQUMsY0FBRCxPQUNBLG9DQUFDLDJCQUFEO0FBQUEsSUFBMkI7QUFBQSxJQUFrQjtBQUFBO0FBQUE7QUFLbkQsZUFBZTsiLAogICJuYW1lcyI6IFtdCn0K

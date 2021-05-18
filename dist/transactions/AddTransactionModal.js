import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast
} from "../../snowpack/pkg/@chakra-ui/react.js";
import Dexie from "../../snowpack/pkg/dexie.js";
import React from "../../snowpack/pkg/react.js";
import {addTransaction} from "../database/transactions/addTransaction.js";
import {useMutation} from "../hooks/useMutation.js";
import TransactionEditForm, {
  transactionTypeTitle
} from "./TransactionEditForm.js";
function AddTransactionModalContent(props) {
  const toast = useToast();
  const {initialValues, onSuccess} = props;
  const {mutate} = useMutation(addTransaction);
  const handleSubmitForm = async (values) => {
    try {
      const result = await mutate({
        accountId: values.accountId,
        amount: values.amount,
        oppositeAccountId: values.oppositeAccountId,
        remark: values.remark,
        transactionType: values.transactionType
      });
      if (result) {
        toast({
          title: `${transactionTypeTitle[result.transactionType]} successfully created`,
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
  return /* @__PURE__ */ React.createElement(ModalContent, null, /* @__PURE__ */ React.createElement(ModalHeader, null, "Transaction"), /* @__PURE__ */ React.createElement(ModalCloseButton, null), /* @__PURE__ */ React.createElement(TransactionEditForm, {
    initialValues,
    renderActions: (formik) => /* @__PURE__ */ React.createElement(ModalFooter, null, /* @__PURE__ */ React.createElement(Button, {
      type: "submit",
      isLoading: formik.isSubmitting
    }, "Add")),
    onSubmit: handleSubmitForm
  }));
}
function AddTransactionModal(props) {
  const {initialValues, onSuccess, ...otherProps} = props;
  return /* @__PURE__ */ React.createElement(Modal, {
    ...otherProps
  }, /* @__PURE__ */ React.createElement(ModalOverlay, null), /* @__PURE__ */ React.createElement(AddTransactionModalContent, {
    initialValues,
    onSuccess
  }));
}
export default AddTransactionModal;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcdHJhbnNhY3Rpb25zXFxBZGRUcmFuc2FjdGlvbk1vZGFsLnRzeCJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBV0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFXQSxvQ0FBb0MsT0FBd0M7QUFDMUUsUUFBTSxRQUFRO0FBQ2QsUUFBTSxDQUFFLGVBQWUsYUFBYztBQUVyQyxRQUFNLENBQUUsVUFBVyxZQUFZO0FBQy9CLFFBQU0sbUJBQW1CLE9BQU8sV0FBeUI7QUFDdkQsUUFBSTtBQUNGLFlBQU0sU0FBUyxNQUFNLE9BQU87QUFBQSxRQUMxQixXQUFXLE9BQU87QUFBQSxRQUNsQixRQUFRLE9BQU87QUFBQSxRQUNmLG1CQUFtQixPQUFPO0FBQUEsUUFDMUIsUUFBUSxPQUFPO0FBQUEsUUFDZixpQkFBaUIsT0FBTztBQUFBO0FBRzFCLFVBQUksUUFBUTtBQUNWLGNBQU07QUFBQSxVQUNKLE9BQU8sR0FDTCxxQkFBcUIsT0FBTztBQUFBLFVBRTlCLFFBQVE7QUFBQSxVQUNSLFlBQVk7QUFBQTtBQUVkLFlBQUk7QUFBVyxvQkFBVTtBQUFBO0FBQUEsYUFFcEIsS0FBUDtBQUNBLFVBQUksZUFBZSxNQUFNO0FBQ3ZCLGNBQU0sQ0FBRSxPQUFPLElBQUksU0FBUyxRQUFRLFNBQVMsWUFBWTtBQUFBO0FBQUE7QUFJL0QsU0FDRSxvQ0FBQyxjQUFELE1BQ0Usb0NBQUMsYUFBRCxNQUFhLGdCQUNiLG9DQUFDLGtCQUFELE9BQ0Esb0NBQUMscUJBQUQ7QUFBQSxJQUNFO0FBQUEsSUFDQSxlQUFlLENBQUMsV0FDZCxvQ0FBQyxhQUFELE1BQ0Usb0NBQUMsUUFBRDtBQUFBLE1BQVEsTUFBSztBQUFBLE1BQVMsV0FBVyxPQUFPO0FBQUEsT0FBYztBQUFBLElBSzFELFVBQVU7QUFBQTtBQUFBO0FBU2xCLDZCQUE2QixPQUFpQztBQUM1RCxRQUFNLENBQUUsZUFBZSxjQUFjLGNBQWU7QUFFcEQsU0FDRSxvQ0FBQyxPQUFEO0FBQUEsT0FBVztBQUFBLEtBQ1Qsb0NBQUMsY0FBRCxPQUNBLG9DQUFDLDRCQUFEO0FBQUEsSUFDRTtBQUFBLElBQ0E7QUFBQTtBQUFBO0FBTVIsZUFBZTsiLAogICJuYW1lcyI6IFtdCn0K

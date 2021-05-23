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
import {updateTag} from "../database/tags/updateTag.js";
import {useMutation} from "../hooks/useMutation.js";
import TagEditForm from "./TagEditForm.js";
function UpdateTagModalContent(props) {
  const toast = useToast();
  const {tag, onSuccess} = props;
  const {mutate} = useMutation(updateTag);
  const onSubmit = async ({name}) => {
    const result = await mutate({id: tag.id, name});
    if (result) {
      toast({
        title: `Tag '${result.name}' successfully updated`,
        status: "success",
        isClosable: true
      });
      if (onSuccess)
        onSuccess(result);
    }
  };
  return /* @__PURE__ */ React.createElement(ModalContent, null, /* @__PURE__ */ React.createElement(ModalHeader, null, "Update Tag"), /* @__PURE__ */ React.createElement(ModalCloseButton, null), /* @__PURE__ */ React.createElement(TagEditForm, {
    initialValues: tag,
    renderActions: (formik) => /* @__PURE__ */ React.createElement(ModalFooter, null, /* @__PURE__ */ React.createElement(Button, {
      type: "submit",
      isLoading: formik.isSubmitting
    }, "Update")),
    onSubmit
  }));
}
function UpdateTagModal(props) {
  const {tag, onSuccess, ...otherProps} = props;
  return /* @__PURE__ */ React.createElement(Modal, {
    ...otherProps
  }, /* @__PURE__ */ React.createElement(ModalOverlay, null), /* @__PURE__ */ React.createElement(UpdateTagModalContent, {
    tag,
    onSuccess
  }));
}
export default UpdateTagModal;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL3RhZ3MvVXBkYXRlVGFnTW9kYWwudHN4Il0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFXQTtBQUVBO0FBQ0E7QUFDQTtBQU9BLCtCQUErQixPQUFtQztBQUNoRSxRQUFNLFFBQVE7QUFDZCxRQUFNLENBQUUsS0FBSyxhQUFjO0FBRTNCLFFBQU0sQ0FBRSxVQUFXLFlBQVk7QUFFL0IsUUFBTSxXQUFXLE9BQU8sQ0FBRSxVQUFtQjtBQUMzQyxVQUFNLFNBQVMsTUFBTSxPQUFPLENBQUUsSUFBSSxJQUFJLElBQUk7QUFDMUMsUUFBSSxRQUFRO0FBQ1YsWUFBTTtBQUFBLFFBQ0osT0FBTyxRQUFRLE9BQU87QUFBQSxRQUN0QixRQUFRO0FBQUEsUUFDUixZQUFZO0FBQUE7QUFFZCxVQUFJO0FBQVcsa0JBQVU7QUFBQTtBQUFBO0FBSTdCLFNBQ0Usb0NBQUMsY0FBRCxNQUNFLG9DQUFDLGFBQUQsTUFBYSxlQUNiLG9DQUFDLGtCQUFELE9BRUEsb0NBQUMsYUFBRDtBQUFBLElBQ0UsZUFBZTtBQUFBLElBQ2YsZUFBZSxDQUFDLFdBQ2Qsb0NBQUMsYUFBRCxNQUNFLG9DQUFDLFFBQUQ7QUFBQSxNQUFRLE1BQUs7QUFBQSxNQUFTLFdBQVcsT0FBTztBQUFBLE9BQWM7QUFBQSxJQUsxRDtBQUFBO0FBQUE7QUFTUix3QkFBd0IsT0FBNEI7QUFDbEQsUUFBTSxDQUFFLEtBQUssY0FBYyxjQUFlO0FBRTFDLFNBQ0Usb0NBQUMsT0FBRDtBQUFBLE9BQVc7QUFBQSxLQUNULG9DQUFDLGNBQUQsT0FDQSxvQ0FBQyx1QkFBRDtBQUFBLElBQXVCO0FBQUEsSUFBVTtBQUFBO0FBQUE7QUFLdkMsZUFBZTsiLAogICJuYW1lcyI6IFtdCn0K

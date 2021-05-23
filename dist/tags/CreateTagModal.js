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
import {createTag} from "../database/tags/createTag.js";
import {useMutation} from "../hooks/useMutation.js";
import TagEditForm from "./TagEditForm.js";
function CreateTagModalContent(props) {
  const toast = useToast();
  const {tag, onSuccess} = props;
  const {mutate} = useMutation(createTag);
  const onSubmit = async ({name}) => {
    try {
      const result = await mutate({name});
      if (result) {
        toast({
          title: `Tag '${result.name}' successfully created`,
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
  return /* @__PURE__ */ React.createElement(ModalContent, null, /* @__PURE__ */ React.createElement(ModalHeader, null, "New Tag"), /* @__PURE__ */ React.createElement(ModalCloseButton, null), /* @__PURE__ */ React.createElement(TagEditForm, {
    initialValues: tag,
    renderActions: (formik) => /* @__PURE__ */ React.createElement(ModalFooter, null, /* @__PURE__ */ React.createElement(Button, {
      type: "submit",
      isLoading: formik.isSubmitting
    }, "Create new tag")),
    onSubmit
  }));
}
function CreateTagModal(props) {
  const {tag, onSuccess, ...otherProps} = props;
  return /* @__PURE__ */ React.createElement(Modal, {
    ...otherProps
  }, /* @__PURE__ */ React.createElement(ModalOverlay, null), /* @__PURE__ */ React.createElement(CreateTagModalContent, {
    tag,
    onSuccess
  }));
}
export default CreateTagModal;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL3RhZ3MvQ3JlYXRlVGFnTW9kYWwudHN4Il0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFXQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBT0EsK0JBQStCLE9BQW1DO0FBQ2hFLFFBQU0sUUFBUTtBQUNkLFFBQU0sQ0FBRSxLQUFLLGFBQWM7QUFFM0IsUUFBTSxDQUFFLFVBQVcsWUFBWTtBQUUvQixRQUFNLFdBQVcsT0FBTyxDQUFFLFVBQW1CO0FBQzNDLFFBQUk7QUFDRixZQUFNLFNBQVMsTUFBTSxPQUFPLENBQUU7QUFDOUIsVUFBSSxRQUFRO0FBQ1YsY0FBTTtBQUFBLFVBQ0osT0FBTyxRQUFRLE9BQU87QUFBQSxVQUN0QixRQUFRO0FBQUEsVUFDUixZQUFZO0FBQUE7QUFFZCxZQUFJO0FBQVcsb0JBQVU7QUFBQTtBQUFBLGFBRXBCLEtBQVA7QUFDQSxVQUFJLGVBQWUsTUFBTTtBQUN2QixjQUFNLENBQUUsT0FBTyxJQUFJLFNBQVMsUUFBUSxTQUFTLFlBQVk7QUFBQTtBQUFBO0FBSS9ELFNBQ0Usb0NBQUMsY0FBRCxNQUNFLG9DQUFDLGFBQUQsTUFBYSxZQUNiLG9DQUFDLGtCQUFELE9BRUEsb0NBQUMsYUFBRDtBQUFBLElBQ0UsZUFBZTtBQUFBLElBQ2YsZUFBZSxDQUFDLFdBQ2Qsb0NBQUMsYUFBRCxNQUNFLG9DQUFDLFFBQUQ7QUFBQSxNQUFRLE1BQUs7QUFBQSxNQUFTLFdBQVcsT0FBTztBQUFBLE9BQWM7QUFBQSxJQUsxRDtBQUFBO0FBQUE7QUFTUix3QkFBd0IsT0FBNEI7QUFDbEQsUUFBTSxDQUFFLEtBQUssY0FBYyxjQUFlO0FBRTFDLFNBQ0Usb0NBQUMsT0FBRDtBQUFBLE9BQVc7QUFBQSxLQUNULG9DQUFDLGNBQUQsT0FDQSxvQ0FBQyx1QkFBRDtBQUFBLElBQXVCO0FBQUEsSUFBVTtBQUFBO0FBQUE7QUFLdkMsZUFBZTsiLAogICJuYW1lcyI6IFtdCn0K

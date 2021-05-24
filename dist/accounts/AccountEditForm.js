import {Input, ModalBody, VStack} from "../../_snowpack/pkg/@chakra-ui/react.js";
import {Form, FormikProvider, useFormik} from "../../_snowpack/pkg/formik.js";
import React, {useMemo} from "../../_snowpack/pkg/react.js";
import * as yup from "../../_snowpack/pkg/yup.js";
import FormikFormControl from "../components/FormikFormControl/index.js";
const validationSchema = yup.object().shape({
  name: yup.string().required()
});
export default function AccountEditForm(props) {
  const {initialValues: initialValuesProp, renderActions, onSubmit} = props;
  const initialValues = useMemo(() => ({
    name: initialValuesProp?.name ?? ""
  }), [initialValuesProp?.name]);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => onSubmit(values)
  });
  return /* @__PURE__ */ React.createElement(FormikProvider, {
    value: formik
  }, /* @__PURE__ */ React.createElement(Form, null, /* @__PURE__ */ React.createElement(ModalBody, {
    as: VStack,
    spacing: 4
  }, /* @__PURE__ */ React.createElement(FormikFormControl, {
    id: "name"
  }, (props2) => /* @__PURE__ */ React.createElement(Input, {
    ...props2,
    placeholder: "Account name"
  }))), renderActions?.(formik)));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2FjY291bnRzL0FjY291bnRFZGl0Rm9ybS50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWUEsTUFBTSxtQkFBbUIsSUFBSSxTQUFTLE1BQU07QUFBQSxFQUMxQyxNQUFNLElBQUksU0FBUztBQUFBO0FBR3JCLHdDQUF3QyxPQUE2QjtBQUNuRSxRQUFNLENBQUUsZUFBZSxtQkFBbUIsZUFBZSxZQUFhO0FBRXRFLFFBQU0sZ0JBQWdCLFFBQ3BCLE1BQU87QUFBQSxJQUNMLE1BQU0sbUJBQW1CLFFBQVE7QUFBQSxNQUVuQyxDQUFDLG1CQUFtQjtBQUd0QixRQUFNLFNBQVMsVUFBa0I7QUFBQSxJQUMvQjtBQUFBLElBQ0E7QUFBQSxJQUNBLFVBQVUsT0FBTyxXQUFXLFNBQVM7QUFBQTtBQUd2QyxTQUNFLG9DQUFDLGdCQUFEO0FBQUEsSUFBZ0IsT0FBTztBQUFBLEtBQ3JCLG9DQUFDLE1BQUQsTUFDRSxvQ0FBQyxXQUFEO0FBQUEsSUFBVyxJQUFJO0FBQUEsSUFBUSxTQUFTO0FBQUEsS0FDOUIsb0NBQUMsbUJBQUQ7QUFBQSxJQUFtQyxJQUFHO0FBQUEsS0FDbkMsQ0FBQyxXQUFVLG9DQUFDLE9BQUQ7QUFBQSxPQUFXO0FBQUEsSUFBTyxhQUFZO0FBQUEsUUFJN0MsZ0JBQWdCO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
import {Input, ModalBody, Select, VStack} from "../../snowpack/pkg/@chakra-ui/react.js";
import {Form, FormikProvider, useFormik} from "../../snowpack/pkg/formik.js";
import React, {useMemo} from "../../snowpack/pkg/react.js";
import * as yup from "../../snowpack/pkg/yup.js";
import FormikFormControl from "../components/FormikFormControl/index.js";
import {accountTypeTitle} from "./AccountListItem.js";
const accountTypes = ["payment_account", "credit_card", "asset"];
const validationSchema = yup.object().shape({
  name: yup.string().required(),
  type: yup.string().required()
});
export default function AccountEditForm(props) {
  const {initialValues: initialValuesProp, renderActions, onSubmit} = props;
  const initialValues = useMemo(() => ({
    name: initialValuesProp?.name ?? "",
    type: initialValuesProp?.type ?? ""
  }), [initialValuesProp?.name, initialValuesProp?.type]);
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
  })), /* @__PURE__ */ React.createElement(FormikFormControl, {
    id: "type"
  }, (props2) => /* @__PURE__ */ React.createElement(Select, {
    ...props2,
    placeholder: "Select an account type"
  }, accountTypes.map((accountType) => /* @__PURE__ */ React.createElement("option", {
    key: accountType,
    value: accountType
  }, accountTypeTitle[accountType]))))), renderActions?.(formik)));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcYWNjb3VudHNcXEFjY291bnRFZGl0Rm9ybS50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFhQSxNQUFNLGVBQThCLENBQUMsbUJBQW1CLGVBQWU7QUFFdkUsTUFBTSxtQkFBbUIsSUFBSSxTQUFTLE1BQU07QUFBQSxFQUMxQyxNQUFNLElBQUksU0FBUztBQUFBLEVBQ25CLE1BQU0sSUFBSSxTQUFTO0FBQUE7QUFHckIsd0NBQXdDLE9BQTZCO0FBQ25FLFFBQU0sQ0FBRSxlQUFlLG1CQUFtQixlQUFlLFlBQWE7QUFFdEUsUUFBTSxnQkFBZ0IsUUFDcEIsTUFBTztBQUFBLElBQ0wsTUFBTSxtQkFBbUIsUUFBUTtBQUFBLElBQ2pDLE1BQU0sbUJBQW1CLFFBQVE7QUFBQSxNQUVuQyxDQUFDLG1CQUFtQixNQUFNLG1CQUFtQjtBQUcvQyxRQUFNLFNBQVMsVUFBa0I7QUFBQSxJQUMvQjtBQUFBLElBQ0E7QUFBQSxJQUNBLFVBQVUsT0FBTyxXQUFXLFNBQVM7QUFBQTtBQUd2QyxTQUNFLG9DQUFDLGdCQUFEO0FBQUEsSUFBZ0IsT0FBTztBQUFBLEtBQ3JCLG9DQUFDLE1BQUQsTUFDRSxvQ0FBQyxXQUFEO0FBQUEsSUFBVyxJQUFJO0FBQUEsSUFBUSxTQUFTO0FBQUEsS0FDOUIsb0NBQUMsbUJBQUQ7QUFBQSxJQUFtQyxJQUFHO0FBQUEsS0FDbkMsQ0FBQyxXQUFVLG9DQUFDLE9BQUQ7QUFBQSxPQUFXO0FBQUEsSUFBTyxhQUFZO0FBQUEsT0FHNUMsb0NBQUMsbUJBQUQ7QUFBQSxJQUFtQyxJQUFHO0FBQUEsS0FDbkMsQ0FBQyxXQUNBLG9DQUFDLFFBQUQ7QUFBQSxPQUFZO0FBQUEsSUFBTyxhQUFZO0FBQUEsS0FDNUIsYUFBYSxJQUFJLENBQUMsZ0JBQ2pCLG9DQUFDLFVBQUQ7QUFBQSxJQUFRLEtBQUs7QUFBQSxJQUFhLE9BQU87QUFBQSxLQUM5QixpQkFBaUIsbUJBUTdCLGdCQUFnQjtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

import {Input, ModalBody, VStack} from "../../_snowpack/pkg/@chakra-ui/react.js";
import {Form, FormikProvider, useFormik} from "../../_snowpack/pkg/formik.js";
import React, {useMemo} from "../../_snowpack/pkg/react.js";
import * as yup from "../../_snowpack/pkg/yup.js";
import FormikFormControl from "../components/FormikFormControl/index.js";
const validationSchema = yup.object().shape({
  name: yup.string().required()
});
export default function TagEditForm(props) {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL3RhZ3MvVGFnRWRpdEZvcm0udHN4Il0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVlBLE1BQU0sbUJBQW1CLElBQUksU0FBUyxNQUFNO0FBQUEsRUFDMUMsTUFBTSxJQUFJLFNBQVM7QUFBQTtBQUdyQixvQ0FBb0MsT0FBeUI7QUFDM0QsUUFBTSxDQUFFLGVBQWUsbUJBQW1CLGVBQWUsWUFBYTtBQUV0RSxRQUFNLGdCQUFnQixRQUNwQixNQUFPO0FBQUEsSUFDTCxNQUFNLG1CQUFtQixRQUFRO0FBQUEsTUFFbkMsQ0FBQyxtQkFBbUI7QUFHdEIsUUFBTSxTQUFTLFVBQWtCO0FBQUEsSUFDL0I7QUFBQSxJQUNBO0FBQUEsSUFDQSxVQUFVLE9BQU8sV0FBVyxTQUFTO0FBQUE7QUFHdkMsU0FDRSxvQ0FBQyxnQkFBRDtBQUFBLElBQWdCLE9BQU87QUFBQSxLQUNyQixvQ0FBQyxNQUFELE1BQ0Usb0NBQUMsV0FBRDtBQUFBLElBQVcsSUFBSTtBQUFBLElBQVEsU0FBUztBQUFBLEtBQzlCLG9DQUFDLG1CQUFEO0FBQUEsSUFBbUMsSUFBRztBQUFBLEtBQ25DLENBQUMsV0FBVSxvQ0FBQyxPQUFEO0FBQUEsT0FBVztBQUFBLElBQU8sYUFBWTtBQUFBLFFBSTdDLGdCQUFnQjtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

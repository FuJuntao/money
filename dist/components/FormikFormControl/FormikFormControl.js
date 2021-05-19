import {
  Collapse,
  FormControl,
  FormErrorMessage
} from "../../../_snowpack/pkg/@chakra-ui/react.js";
import {useField} from "../../../_snowpack/pkg/formik.js";
import React from "../../../_snowpack/pkg/react.js";
export default function FormikFormControl(props) {
  const {children, ...otherProps} = props;
  const [fieldInputProps, {touched, error}] = useField(props.id);
  const isInvalid = !!(touched && error);
  return /* @__PURE__ */ React.createElement(FormControl, {
    isInvalid,
    ...otherProps
  }, children(fieldInputProps), /* @__PURE__ */ React.createElement(Collapse, {
    in: isInvalid
  }, /* @__PURE__ */ React.createElement(FormErrorMessage, null, error)));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2NvbXBvbmVudHMvRm9ybWlrRm9ybUNvbnRyb2wvRm9ybWlrRm9ybUNvbnRyb2wudHN4Il0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1BO0FBQ0E7QUFVQSwwQ0FDRSxPQUNBO0FBQ0EsUUFBTSxDQUFFLGFBQWEsY0FBZTtBQUVwQyxRQUFNLENBQUMsaUJBQWlCLENBQUUsU0FBUyxVQUFXLFNBQVMsTUFBTTtBQUM3RCxRQUFNLFlBQVksQ0FBQyxDQUFFLFlBQVc7QUFFaEMsU0FDRSxvQ0FBQyxhQUFEO0FBQUEsSUFBYTtBQUFBLE9BQTBCO0FBQUEsS0FDcEMsU0FBUyxrQkFFVixvQ0FBQyxVQUFEO0FBQUEsSUFBVSxJQUFJO0FBQUEsS0FDWixvQ0FBQyxrQkFBRCxNQUFtQjtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcY29tcG9uZW50c1xcRm9ybWlrRm9ybUNvbnRyb2xcXEZvcm1pa0Zvcm1Db250cm9sLnRzeCJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNQTtBQUNBO0FBVUEsMENBQ0UsT0FDQTtBQUNBLFFBQU0sQ0FBRSxhQUFhLGNBQWU7QUFFcEMsUUFBTSxDQUFDLGlCQUFpQixDQUFFLFNBQVMsVUFBVyxTQUFTLE1BQU07QUFDN0QsUUFBTSxZQUFZLENBQUMsQ0FBRSxZQUFXO0FBRWhDLFNBQ0Usb0NBQUMsYUFBRDtBQUFBLElBQWE7QUFBQSxPQUEwQjtBQUFBLEtBQ3BDLFNBQVMsa0JBRVYsb0NBQUMsVUFBRDtBQUFBLElBQVUsSUFBSTtBQUFBLEtBQ1osb0NBQUMsa0JBQUQsTUFBbUI7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K

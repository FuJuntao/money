import {chakra} from "../../../_snowpack/pkg/@chakra-ui/react.js";
import React, {forwardRef} from "../../../_snowpack/pkg/react.js";
const Amount = forwardRef((props, ref) => {
  const {children, currency, ...otherProps} = props;
  return /* @__PURE__ */ React.createElement(chakra.span, {
    ref,
    ...otherProps
  }, Intl.NumberFormat(void 0, {style: "currency", currency}).format(children));
});
export default Amount;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2NvbXBvbmVudHMvQW1vdW50L0Ftb3VudC50c3giXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUNBO0FBRUEsTUFBTSxTQUFTLFdBR2IsQ0FBQyxPQUFPLFFBQVE7QUFDaEIsUUFBTSxDQUFFLFVBQVUsYUFBYSxjQUFlO0FBRTlDLFNBQ0Usb0NBQUMsT0FBTyxNQUFSO0FBQUEsSUFBYTtBQUFBLE9BQWM7QUFBQSxLQUN4QixLQUFLLGFBQWEsUUFBVyxDQUFFLE9BQU8sWUFBWSxXQUFZLE9BQzdEO0FBQUE7QUFNUixlQUFlOyIsCiAgIm5hbWVzIjogW10KfQo=

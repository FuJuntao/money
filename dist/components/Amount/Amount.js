import {chakra} from "../../../snowpack/pkg/@chakra-ui/react.js";
import React, {forwardRef} from "../../../snowpack/pkg/react.js";
const Amount = forwardRef((props, ref) => {
  const {children, currency, ...otherProps} = props;
  return /* @__PURE__ */ React.createElement(chakra.span, {
    ref,
    ...otherProps
  }, Intl.NumberFormat(void 0, {style: "currency", currency}).format(children));
});
export default Amount;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcY29tcG9uZW50c1xcQW1vdW50XFxBbW91bnQudHN4Il0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFDQTtBQUVBLE1BQU0sU0FBUyxXQUdiLENBQUMsT0FBTyxRQUFRO0FBQ2hCLFFBQU0sQ0FBRSxVQUFVLGFBQWEsY0FBZTtBQUU5QyxTQUNFLG9DQUFDLE9BQU8sTUFBUjtBQUFBLElBQWE7QUFBQSxPQUFjO0FBQUEsS0FDeEIsS0FBSyxhQUFhLFFBQVcsQ0FBRSxPQUFPLFlBQVksV0FBWSxPQUM3RDtBQUFBO0FBTVIsZUFBZTsiLAogICJuYW1lcyI6IFtdCn0K

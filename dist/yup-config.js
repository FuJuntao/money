import {Decimal} from "../_snowpack/pkg/decimaljs.js";
import * as yup from "../_snowpack/pkg/yup.js";
function maxDigitsAfterDecimal(maxDigits, message) {
  return this.test("maxDigitsAfterDecimal", message ?? `\${path} must have ${maxDigits} digits or less after decimal`, (value = 0) => new Decimal(value).dp() <= maxDigits);
}
yup.addMethod(yup.number, "maxDigits", maxDigitsAfterDecimal);
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL3l1cC1jb25maWcudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUNBO0FBRUEsK0JBRUUsV0FDQSxTQUNBO0FBQ0EsU0FBTyxLQUFLLEtBQ1YseUJBQ0EsV0FBVyxzQkFBc0IsMENBQ2pDLENBQUMsUUFBUSxNQUFNLElBQUksUUFBUSxPQUFPLFFBQVE7QUFBQTtBQUk5QyxJQUFJLFVBQVUsSUFBSSxRQUFRLGFBQWE7IiwKICAibmFtZXMiOiBbXQp9Cg==

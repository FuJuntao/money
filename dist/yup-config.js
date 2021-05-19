import * as yup from "../_snowpack/pkg/yup.js";
function maxDigitsAfterDecimal(maxDigits, message) {
  return this.test("maxDigitsAfterDecimal", message ?? `\${path} must have ${maxDigits} digits or less after decimal`, (value = 0) => Number.isInteger(value * 10 ** maxDigits));
}
yup.addMethod(yup.number, "maxDigits", maxDigitsAfterDecimal);
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL3l1cC1jb25maWcudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUVBLCtCQUVFLFdBQ0EsU0FDQTtBQUNBLFNBQU8sS0FBSyxLQUNWLHlCQUNBLFdBQVcsc0JBQXNCLDBDQUNqQyxDQUFDLFFBQVEsTUFBTSxPQUFPLFVBQVUsUUFBUSxNQUFNO0FBQUE7QUFJbEQsSUFBSSxVQUFVLElBQUksUUFBUSxhQUFhOyIsCiAgIm5hbWVzIjogW10KfQo=

import * as yup from "../_snowpack/pkg/yup.js";
function maxDigitsAfterDecimal(maxDigits, message) {
  return this.test("maxDigitsAfterDecimal", message ?? `\${path} must have ${maxDigits} digits or less after decimal`, (value = 0) => Number.isInteger(value * 10 ** maxDigits));
}
yup.addMethod(yup.number, "maxDigits", maxDigitsAfterDecimal);
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xceXVwLWNvbmZpZy50cyJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBRUEsK0JBRUUsV0FDQSxTQUNBO0FBQ0EsU0FBTyxLQUFLLEtBQ1YseUJBQ0EsV0FBVyxzQkFBc0IsMENBQ2pDLENBQUMsUUFBUSxNQUFNLE9BQU8sVUFBVSxRQUFRLE1BQU07QUFBQTtBQUlsRCxJQUFJLFVBQVUsSUFBSSxRQUFRLGFBQWE7IiwKICAibmFtZXMiOiBbXQp9Cg==

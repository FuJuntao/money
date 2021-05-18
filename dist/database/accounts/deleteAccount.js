import {db} from "../MoneyDB.js";
export function deleteAccount({id}) {
  return db.accounts.where("id").equals(id).delete();
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcZGF0YWJhc2VcXGFjY291bnRzXFxkZWxldGVBY2NvdW50LnRzIl0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFFTyw4QkFBdUIsQ0FBRSxLQUFrQjtBQUNoRCxTQUFPLEdBQUcsU0FBUyxNQUFNLE1BQU0sT0FBTyxJQUFJO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==

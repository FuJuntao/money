import {db} from "../MoneyDB.js";
export function updateAccount({id, name, type}) {
  const table = db.accounts;
  return table.update(id, {name, type}).then(() => table.where("id").equals(id).first());
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcZGF0YWJhc2VcXGFjY291bnRzXFx1cGRhdGVBY2NvdW50LnRzIl0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFHTyw4QkFBdUIsQ0FBRSxJQUFJLE1BQU0sT0FBdUI7QUFDL0QsUUFBTSxRQUFRLEdBQUc7QUFDakIsU0FBTyxNQUNKLE9BQU8sSUFBSSxDQUFFLE1BQU0sT0FDbkIsS0FBSyxNQUFNLE1BQU0sTUFBTSxNQUFNLE9BQU8sSUFBSTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

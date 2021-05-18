import {db} from "../MoneyDB.js";
export function createAccount({name, type}) {
  return db.accounts.add({name, type}).then(async (accountId) => db.accounts.where("id").equals(accountId).first());
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcZGF0YWJhc2VcXGFjY291bnRzXFxjcmVhdGVBY2NvdW50LnRzIl0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFHTyw4QkFBdUIsQ0FBRSxNQUFNLE9BQWlCO0FBQ3JELFNBQU8sR0FBRyxTQUNQLElBQUksQ0FBRSxNQUFNLE9BQ1osS0FBSyxPQUFPLGNBQ1gsR0FBRyxTQUFTLE1BQU0sTUFBTSxPQUFPLFdBQVc7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K

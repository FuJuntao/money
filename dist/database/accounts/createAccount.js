import {db} from "../MoneyDB.js";
export function createAccount({name}) {
  return db.accounts.add({name}).then(async (accountId) => db.accounts.where("id").equals(accountId).first());
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2RhdGFiYXNlL2FjY291bnRzL2NyZWF0ZUFjY291bnQudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUdPLDhCQUF1QixDQUFFLE9BQWlCO0FBQy9DLFNBQU8sR0FBRyxTQUNQLElBQUksQ0FBRSxPQUNOLEtBQUssT0FBTyxjQUNYLEdBQUcsU0FBUyxNQUFNLE1BQU0sT0FBTyxXQUFXO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==

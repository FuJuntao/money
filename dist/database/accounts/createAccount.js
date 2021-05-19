import {db} from "../MoneyDB.js";
export function createAccount({name, type}) {
  return db.accounts.add({name, type}).then(async (accountId) => db.accounts.where("id").equals(accountId).first());
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2RhdGFiYXNlL2FjY291bnRzL2NyZWF0ZUFjY291bnQudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUdPLDhCQUF1QixDQUFFLE1BQU0sT0FBaUI7QUFDckQsU0FBTyxHQUFHLFNBQ1AsSUFBSSxDQUFFLE1BQU0sT0FDWixLQUFLLE9BQU8sY0FDWCxHQUFHLFNBQVMsTUFBTSxNQUFNLE9BQU8sV0FBVztBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

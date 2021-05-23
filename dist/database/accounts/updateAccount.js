import {db} from "../MoneyDB.js";
export function updateAccount({id, name}) {
  const table = db.accounts;
  return table.update(id, {name}).then(() => table.where("id").equals(id).first());
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2RhdGFiYXNlL2FjY291bnRzL3VwZGF0ZUFjY291bnQudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUdPLDhCQUF1QixDQUFFLElBQUksT0FBdUI7QUFDekQsUUFBTSxRQUFRLEdBQUc7QUFDakIsU0FBTyxNQUNKLE9BQU8sSUFBSSxDQUFFLE9BQ2IsS0FBSyxNQUFNLE1BQU0sTUFBTSxNQUFNLE9BQU8sSUFBSTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

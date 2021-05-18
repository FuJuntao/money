import {db} from "../MoneyDB.js";
export function updateAccount({id, name, type}) {
  const table = db.accounts;
  return table.update(id, {name, type}).then(() => table.where("id").equals(id).first());
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2RhdGFiYXNlL2FjY291bnRzL3VwZGF0ZUFjY291bnQudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUdPLDhCQUF1QixDQUFFLElBQUksTUFBTSxPQUF1QjtBQUMvRCxRQUFNLFFBQVEsR0FBRztBQUNqQixTQUFPLE1BQ0osT0FBTyxJQUFJLENBQUUsTUFBTSxPQUNuQixLQUFLLE1BQU0sTUFBTSxNQUFNLE1BQU0sT0FBTyxJQUFJO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==

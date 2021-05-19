import {db} from "../MoneyDB.js";
export function deleteAccount({id}) {
  return db.accounts.where("id").equals(id).delete();
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2RhdGFiYXNlL2FjY291bnRzL2RlbGV0ZUFjY291bnQudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUVPLDhCQUF1QixDQUFFLEtBQWtCO0FBQ2hELFNBQU8sR0FBRyxTQUFTLE1BQU0sTUFBTSxPQUFPLElBQUk7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K

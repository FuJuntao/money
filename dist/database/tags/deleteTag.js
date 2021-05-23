import {db} from "../MoneyDB.js";
export function deleteTag({id}) {
  return db.tags.where("id").equals(id).delete();
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2RhdGFiYXNlL3RhZ3MvZGVsZXRlVGFnLnRzIl0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFFTywwQkFBbUIsQ0FBRSxLQUFrQjtBQUM1QyxTQUFPLEdBQUcsS0FBSyxNQUFNLE1BQU0sT0FBTyxJQUFJO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==

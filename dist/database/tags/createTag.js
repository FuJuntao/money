import {db} from "../MoneyDB.js";
export function createTag({name}) {
  const table = db.tags;
  return table.add({name}).then(async (tagId) => table.where("id").equals(tagId).first());
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2RhdGFiYXNlL3RhZ3MvY3JlYXRlVGFnLnRzIl0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFHTywwQkFBbUIsQ0FBRSxPQUFhO0FBQ3ZDLFFBQU0sUUFBUSxHQUFHO0FBQ2pCLFNBQU8sTUFDSixJQUFJLENBQUUsT0FDTixLQUFLLE9BQU8sVUFBVSxNQUFNLE1BQU0sTUFBTSxPQUFPLE9BQU87QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K

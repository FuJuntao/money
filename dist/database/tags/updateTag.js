import {db} from "../MoneyDB.js";
export function updateTag({id, name}) {
  const table = db.tags;
  return table.update(id, {name}).then(() => table.where("id").equals(id).first());
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2RhdGFiYXNlL3RhZ3MvdXBkYXRlVGFnLnRzIl0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFHTywwQkFBbUIsQ0FBRSxJQUFJLE9BQW1CO0FBQ2pELFFBQU0sUUFBUSxHQUFHO0FBQ2pCLFNBQU8sTUFDSixPQUFPLElBQUksQ0FBRSxPQUNiLEtBQUssTUFBTSxNQUFNLE1BQU0sTUFBTSxPQUFPLElBQUk7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K

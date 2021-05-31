import Dexie from "../../_snowpack/pkg/dexie.js";
import "../../_snowpack/pkg/dexie-export-import.js";
export class MoneyDB extends Dexie {
  constructor(options) {
    super("money", options);
    this.version(1).stores({
      accounts: "++id, &name",
      transactions: "++id, accountId, amount, createdAt, oppositeAccountId, remark, tagIds, transactionType, updatedAt",
      tags: "++id, &name"
    });
    this.accounts = this.table("accounts");
    this.transactions = this.table("transactions");
    this.tags = this.table("tags");
  }
}
export const db = new MoneyDB();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2RhdGFiYXNlL01vbmV5REIudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQU1BO0FBa0NPLDZCQUFzQixNQUFNO0FBQUEsRUFLakMsWUFBWSxTQUF3QjtBQUNsQyxVQUFNLFNBQVM7QUFFZixTQUFLLFFBQVEsR0FBRyxPQUFPO0FBQUEsTUFDckIsVUFBVTtBQUFBLE1BQ1YsY0FDRTtBQUFBLE1BQ0YsTUFBTTtBQUFBO0FBR1IsU0FBSyxXQUFXLEtBQUssTUFBTTtBQUkzQixTQUFLLGVBQWUsS0FBSyxNQUN2QjtBQUVGLFNBQUssT0FBTyxLQUFLLE1BQU07QUFBQTtBQUFBO0FBSXBCLGFBQU0sS0FBSyxJQUFJOyIsCiAgIm5hbWVzIjogW10KfQo=

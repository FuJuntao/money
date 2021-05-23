import Dexie from "../../_snowpack/pkg/dexie.js";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2RhdGFiYXNlL01vbmV5REIudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQXVDTyw2QkFBc0IsTUFBTTtBQUFBLEVBS2pDLFlBQVksU0FBd0I7QUFDbEMsVUFBTSxTQUFTO0FBRWYsU0FBSyxRQUFRLEdBQUcsT0FBTztBQUFBLE1BQ3JCLFVBQVU7QUFBQSxNQUNWLGNBQ0U7QUFBQSxNQUNGLE1BQU07QUFBQTtBQUdSLFNBQUssV0FBVyxLQUFLLE1BQU07QUFJM0IsU0FBSyxlQUFlLEtBQUssTUFDdkI7QUFFRixTQUFLLE9BQU8sS0FBSyxNQUFNO0FBQUE7QUFBQTtBQUlwQixhQUFNLEtBQUssSUFBSTsiLAogICJuYW1lcyI6IFtdCn0K

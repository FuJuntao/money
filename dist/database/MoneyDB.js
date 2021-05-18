import Dexie from "../../_snowpack/pkg/dexie.js";
export class MoneyDB extends Dexie {
  constructor(options) {
    super("money", options);
    this.version(1).stores({
      accounts: "++id, &name, type",
      transactions: "++id, accountId, amount, createdAt, oppositeAccountId, remark, transactionType, updatedAt"
    });
    this.accounts = this.table("accounts");
    this.transactions = this.table("transactions");
  }
}
export const db = new MoneyDB();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2RhdGFiYXNlL01vbmV5REIudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQXNDTyw2QkFBc0IsTUFBTTtBQUFBLEVBSWpDLFlBQVksU0FBd0I7QUFDbEMsVUFBTSxTQUFTO0FBRWYsU0FBSyxRQUFRLEdBQUcsT0FBTztBQUFBLE1BQ3JCLFVBQVU7QUFBQSxNQUNWLGNBQ0U7QUFBQTtBQUdKLFNBQUssV0FBVyxLQUFLLE1BQU07QUFJM0IsU0FBSyxlQUFlLEtBQUssTUFDdkI7QUFBQTtBQUFBO0FBS0MsYUFBTSxLQUFLLElBQUk7IiwKICAibmFtZXMiOiBbXQp9Cg==

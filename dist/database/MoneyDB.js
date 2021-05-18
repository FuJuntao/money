import Dexie from "../../snowpack/pkg/dexie.js";
export class MoneyDB extends Dexie {
  constructor(options) {
    super("money", options);
    this.version(1).stores({
      accounts: "++id, &name, type",
      transactions: "++id, accountId, amount, createdAt, oppositeAccountId, remark, tagIds, transactionType, updatedAt",
      tags: "++id, &name"
    });
    this.accounts = this.table("accounts");
    this.transactions = this.table("transactions");
  }
}
export const db = new MoneyDB();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcZGF0YWJhc2VcXE1vbmV5REIudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQXNDTyw2QkFBc0IsTUFBTTtBQUFBLEVBSWpDLFlBQVksU0FBd0I7QUFDbEMsVUFBTSxTQUFTO0FBRWYsU0FBSyxRQUFRLEdBQUcsT0FBTztBQUFBLE1BQ3JCLFVBQVU7QUFBQSxNQUNWLGNBQ0U7QUFBQSxNQUNGLE1BQU07QUFBQTtBQUdSLFNBQUssV0FBVyxLQUFLLE1BQU07QUFJM0IsU0FBSyxlQUFlLEtBQUssTUFDdkI7QUFBQTtBQUFBO0FBS0MsYUFBTSxLQUFLLElBQUk7IiwKICAibmFtZXMiOiBbXQp9Cg==

import {db} from "../MoneyDB.js";
export function addTransaction(input) {
  const {accountId, amount, oppositeAccountId, remark, transactionType} = input;
  const createdAt = new Date();
  const updatedAt = new Date();
  const transactionTable = db.transactions;
  return transactionTable.add({
    accountId,
    amount,
    createdAt,
    oppositeAccountId,
    remark,
    tagIds: [],
    transactionType,
    updatedAt
  }).then(async (id) => transactionTable.where("id").equals(id).first());
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcZGF0YWJhc2VcXHRyYW5zYWN0aW9uc1xcYWRkVHJhbnNhY3Rpb24udHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQVdPLCtCQUF3QixPQUE0QjtBQUN6RCxRQUFNLENBQUUsV0FBVyxRQUFRLG1CQUFtQixRQUFRLG1CQUNwRDtBQUNGLFFBQU0sWUFBWSxJQUFJO0FBQ3RCLFFBQU0sWUFBWSxJQUFJO0FBRXRCLFFBQU0sbUJBQW1CLEdBQUc7QUFFNUIsU0FBTyxpQkFDSixJQUFJO0FBQUEsSUFDSDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUVBLFFBQVE7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLEtBRUQsS0FBSyxPQUFPLE9BQU8saUJBQWlCLE1BQU0sTUFBTSxPQUFPLElBQUk7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K

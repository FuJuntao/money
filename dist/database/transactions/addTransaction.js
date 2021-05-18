import {db} from "../MoneyDB.js";
export function addTransaction(input) {
  const {
    accountId,
    amount,
    oppositeAccountId,
    remark,
    transactionType
  } = input;
  const createdAt = new Date();
  const updatedAt = new Date();
  const transactionTable = db.transactions;
  return transactionTable.add({
    accountId,
    amount,
    createdAt,
    oppositeAccountId,
    remark,
    transactionType,
    updatedAt
  }).then(async (id) => transactionTable.where("id").equals(id).first());
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2RhdGFiYXNlL3RyYW5zYWN0aW9ucy9hZGRUcmFuc2FjdGlvbi50cyJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBV08sK0JBQXdCLE9BQTRCO0FBQ3pELFFBQU07QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLE1BQ0U7QUFDSixRQUFNLFlBQVksSUFBSTtBQUN0QixRQUFNLFlBQVksSUFBSTtBQUV0QixRQUFNLG1CQUFtQixHQUFHO0FBRTVCLFNBQU8saUJBQ0osSUFBSTtBQUFBLElBQ0g7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxLQUVELEtBQUssT0FBTyxPQUFPLGlCQUFpQixNQUFNLE1BQU0sT0FBTyxJQUFJO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==

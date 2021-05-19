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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvbW9uZXkvbW9uZXkvc3JjL2RhdGFiYXNlL3RyYW5zYWN0aW9ucy9hZGRUcmFuc2FjdGlvbi50cyJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBV08sK0JBQXdCLE9BQTRCO0FBQ3pELFFBQU0sQ0FBRSxXQUFXLFFBQVEsbUJBQW1CLFFBQVEsbUJBQ3BEO0FBQ0YsUUFBTSxZQUFZLElBQUk7QUFDdEIsUUFBTSxZQUFZLElBQUk7QUFFdEIsUUFBTSxtQkFBbUIsR0FBRztBQUU1QixTQUFPLGlCQUNKLElBQUk7QUFBQSxJQUNIO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBRUEsUUFBUTtBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsS0FFRCxLQUFLLE9BQU8sT0FBTyxpQkFBaUIsTUFBTSxNQUFNLE9BQU8sSUFBSTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

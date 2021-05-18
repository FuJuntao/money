import {
  Collapse,
  ModalBody,
  NumberInput,
  NumberInputField,
  Select,
  Textarea,
  VStack
} from "../../snowpack/pkg/@chakra-ui/react.js";
import {useLiveQuery} from "../../snowpack/pkg/dexie-react-hooks.js";
import {
  Form,
  FormikProvider,
  useFormik,
  useFormikContext
} from "../../snowpack/pkg/formik.js";
import React, {useMemo} from "../../snowpack/pkg/react.js";
import * as yup from "../../snowpack/pkg/yup.js";
import FormikFormControl from "../components/FormikFormControl/index.js";
import {db} from "../database/MoneyDB.js";
const getAccounts = () => db.accounts.toArray();
const transactionTypes = ["out", "in", "transfer"];
export const transactionTypeTitle = {
  out: "Expense",
  in: "Income",
  transfer: "Transfer"
};
function TransactionTypeField() {
  return /* @__PURE__ */ React.createElement(FormikFormControl, {
    id: "transactionType"
  }, (props) => /* @__PURE__ */ React.createElement(Select, {
    ...props
  }, transactionTypes?.map((type) => /* @__PURE__ */ React.createElement("option", {
    key: type,
    value: type
  }, transactionTypeTitle[type]))));
}
function AmountField() {
  const formik = useFormikContext();
  return /* @__PURE__ */ React.createElement(FormikFormControl, {
    id: "amount"
  }, (props) => /* @__PURE__ */ React.createElement(NumberInput, {
    ...props,
    min: 0,
    onChange: (valueAsString) => formik.setFieldValue("amount", valueAsString)
  }, /* @__PURE__ */ React.createElement(NumberInputField, {
    placeholder: "Amount"
  })));
}
function AccountField() {
  const accounts = useLiveQuery(getAccounts);
  return /* @__PURE__ */ React.createElement(FormikFormControl, {
    id: "accountId"
  }, (props) => /* @__PURE__ */ React.createElement(Select, {
    ...props,
    placeholder: "Select an account"
  }, accounts?.map(({id, name}) => /* @__PURE__ */ React.createElement("option", {
    key: id,
    value: id
  }, name))));
}
function TransferToAccountField() {
  const accounts = useLiveQuery(getAccounts);
  return /* @__PURE__ */ React.createElement(FormikFormControl, {
    id: "oppositeAccountId"
  }, (props) => /* @__PURE__ */ React.createElement(Select, {
    ...props,
    placeholder: "Transfer to"
  }, accounts?.map(({id, name}) => /* @__PURE__ */ React.createElement("option", {
    key: id,
    value: id
  }, name))));
}
function RemarkField() {
  return /* @__PURE__ */ React.createElement(FormikFormControl, {
    id: "remark"
  }, (props) => /* @__PURE__ */ React.createElement(Textarea, {
    ...props,
    placeholder: "Remark"
  }));
}
const validationSchema = yup.object({
  transactionType: yup.string().required(),
  amount: yup.number().label("Amount").required().moreThan(0).maxDigits(2),
  accountId: yup.string().label("Account").required(),
  oppositeAccountId: yup.string().label("Transfer to").when("transactionType", {is: "transfer", then: yup.string().required()})
});
export default function TransactionEditForm(props) {
  const {initialValues: initialValuesProp, renderActions, onSubmit} = props;
  const initialValues = useMemo(() => ({
    accountId: initialValuesProp?.accountId?.toString() ?? "",
    amount: initialValuesProp?.amount?.toString() ?? "",
    oppositeAccountId: initialValuesProp?.oppositeAccountId?.toString() ?? "",
    remark: initialValuesProp?.remark ?? "",
    transactionType: initialValuesProp?.transactionType ?? "out"
  }), [
    initialValuesProp?.accountId,
    initialValuesProp?.amount,
    initialValuesProp?.oppositeAccountId,
    initialValuesProp?.remark,
    initialValuesProp?.transactionType
  ]);
  const handleSubmit = async ({
    accountId,
    amount,
    oppositeAccountId,
    remark,
    transactionType
  }) => onSubmit({
    transactionType,
    amount: Number.parseFloat(amount),
    accountId: Number.parseInt(accountId.toString()),
    ...transactionType === "transfer" ? {
      oppositeAccountId: Number.parseInt(oppositeAccountId.toString())
    } : null,
    remark
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit
  });
  return /* @__PURE__ */ React.createElement(FormikProvider, {
    value: formik
  }, /* @__PURE__ */ React.createElement(Form, null, /* @__PURE__ */ React.createElement(ModalBody, {
    as: VStack,
    align: "stretch",
    spacing: 4
  }, /* @__PURE__ */ React.createElement(TransactionTypeField, null), /* @__PURE__ */ React.createElement(AmountField, null), /* @__PURE__ */ React.createElement(AccountField, null), /* @__PURE__ */ React.createElement(Collapse, {
    in: formik.values.transactionType === "transfer"
  }, /* @__PURE__ */ React.createElement(TransferToAccountField, null)), /* @__PURE__ */ React.createElement(RemarkField, null)), renderActions?.(formik)));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcdHJhbnNhY3Rpb25zXFxUcmFuc2FjdGlvbkVkaXRGb3JtLnRzeCJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFHQSxNQUFNLGNBQWMsTUFBTSxHQUFHLFNBQVM7QUFVdEMsTUFBTSxtQkFBc0MsQ0FBQyxPQUFPLE1BQU07QUFFbkQsYUFBTSx1QkFBd0Q7QUFBQSxFQUNuRSxLQUFLO0FBQUEsRUFDTCxJQUFJO0FBQUEsRUFDSixVQUFVO0FBQUE7QUFHWixnQ0FBZ0M7QUFDOUIsU0FDRSxvQ0FBQyxtQkFBRDtBQUFBLElBQThDLElBQUc7QUFBQSxLQUM5QyxDQUFDLFVBQ0Esb0NBQUMsUUFBRDtBQUFBLE9BQVk7QUFBQSxLQUNULGtCQUFrQixJQUFJLENBQUMsU0FDdEIsb0NBQUMsVUFBRDtBQUFBLElBQVEsS0FBSztBQUFBLElBQU0sT0FBTztBQUFBLEtBQ3ZCLHFCQUFxQjtBQUFBO0FBU3BDLHVCQUF1QjtBQUNyQixRQUFNLFNBQVM7QUFFZixTQUNFLG9DQUFDLG1CQUFEO0FBQUEsSUFBcUMsSUFBRztBQUFBLEtBQ3JDLENBQUMsVUFDQSxvQ0FBQyxhQUFEO0FBQUEsT0FDTTtBQUFBLElBQ0osS0FBSztBQUFBLElBQ0wsVUFBVSxDQUFDLGtCQUNULE9BQU8sY0FBYyxVQUFVO0FBQUEsS0FHakMsb0NBQUMsa0JBQUQ7QUFBQSxJQUFrQixhQUFZO0FBQUE7QUFBQTtBQU94Qyx3QkFBd0I7QUFDdEIsUUFBTSxXQUFXLGFBQWE7QUFFOUIsU0FDRSxvQ0FBQyxtQkFBRDtBQUFBLElBQXdDLElBQUc7QUFBQSxLQUN4QyxDQUFDLFVBQ0Esb0NBQUMsUUFBRDtBQUFBLE9BQVk7QUFBQSxJQUFPLGFBQVk7QUFBQSxLQUM1QixVQUFVLElBQUksQ0FBQyxDQUFFLElBQUksVUFDcEIsb0NBQUMsVUFBRDtBQUFBLElBQVEsS0FBSztBQUFBLElBQUksT0FBTztBQUFBLEtBQ3JCO0FBQUE7QUFTZixrQ0FBa0M7QUFDaEMsUUFBTSxXQUFXLGFBQWE7QUFFOUIsU0FDRSxvQ0FBQyxtQkFBRDtBQUFBLElBQWdELElBQUc7QUFBQSxLQUNoRCxDQUFDLFVBQ0Esb0NBQUMsUUFBRDtBQUFBLE9BQVk7QUFBQSxJQUFPLGFBQVk7QUFBQSxLQUM1QixVQUFVLElBQUksQ0FBQyxDQUFFLElBQUksVUFDcEIsb0NBQUMsVUFBRDtBQUFBLElBQVEsS0FBSztBQUFBLElBQUksT0FBTztBQUFBLEtBQ3JCO0FBQUE7QUFTZix1QkFBdUI7QUFDckIsU0FDRSxvQ0FBQyxtQkFBRDtBQUFBLElBQXFDLElBQUc7QUFBQSxLQUNyQyxDQUFDLFVBQVUsb0NBQUMsVUFBRDtBQUFBLE9BQWM7QUFBQSxJQUFPLGFBQVk7QUFBQTtBQUFBO0FBMkJuRCxNQUFNLG1CQUFtQixJQUFJLE9BQU87QUFBQSxFQUNsQyxpQkFBaUIsSUFBSSxTQUFTO0FBQUEsRUFDOUIsUUFBUSxJQUFJLFNBQVMsTUFBTSxVQUFVLFdBQVcsU0FBUyxHQUFHLFVBQVU7QUFBQSxFQUN0RSxXQUFXLElBQUksU0FBUyxNQUFNLFdBQVc7QUFBQSxFQUN6QyxtQkFBbUIsSUFDaEIsU0FDQSxNQUFNLGVBQ04sS0FBSyxtQkFBbUIsQ0FBRSxJQUFJLFlBQVksTUFBTSxJQUFJLFNBQVM7QUFBQTtBQUdsRSw0Q0FBNEMsT0FBaUM7QUFDM0UsUUFBTSxDQUFFLGVBQWUsbUJBQW1CLGVBQWUsWUFBYTtBQUV0RSxRQUFNLGdCQUFnQixRQUNwQixNQUFPO0FBQUEsSUFDTCxXQUFXLG1CQUFtQixXQUFXLGNBQWM7QUFBQSxJQUN2RCxRQUFRLG1CQUFtQixRQUFRLGNBQWM7QUFBQSxJQUNqRCxtQkFBbUIsbUJBQW1CLG1CQUFtQixjQUFjO0FBQUEsSUFDdkUsUUFBUSxtQkFBbUIsVUFBVTtBQUFBLElBQ3JDLGlCQUFpQixtQkFBbUIsbUJBQW1CO0FBQUEsTUFFekQ7QUFBQSxJQUNFLG1CQUFtQjtBQUFBLElBQ25CLG1CQUFtQjtBQUFBLElBQ25CLG1CQUFtQjtBQUFBLElBQ25CLG1CQUFtQjtBQUFBLElBQ25CLG1CQUFtQjtBQUFBO0FBSXZCLFFBQU0sZUFBZSxPQUFPO0FBQUEsSUFDMUI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsUUFFQSxTQUFTO0FBQUEsSUFDUDtBQUFBLElBQ0EsUUFBUSxPQUFPLFdBQVc7QUFBQSxJQUMxQixXQUFXLE9BQU8sU0FBUyxVQUFVO0FBQUEsT0FDakMsb0JBQW9CLGFBQ3BCO0FBQUEsTUFDRSxtQkFBbUIsT0FBTyxTQUFTLGtCQUFrQjtBQUFBLFFBRXZEO0FBQUEsSUFDSjtBQUFBO0FBR0osUUFBTSxTQUFTLFVBQWtCO0FBQUEsSUFDL0I7QUFBQSxJQUNBO0FBQUEsSUFDQSxVQUFVO0FBQUE7QUFHWixTQUNFLG9DQUFDLGdCQUFEO0FBQUEsSUFBZ0IsT0FBTztBQUFBLEtBQ3JCLG9DQUFDLE1BQUQsTUFDRSxvQ0FBQyxXQUFEO0FBQUEsSUFBVyxJQUFJO0FBQUEsSUFBUSxPQUFNO0FBQUEsSUFBVSxTQUFTO0FBQUEsS0FDOUMsb0NBQUMsc0JBQUQsT0FDQSxvQ0FBQyxhQUFELE9BQ0Esb0NBQUMsY0FBRCxPQUNBLG9DQUFDLFVBQUQ7QUFBQSxJQUFVLElBQUksT0FBTyxPQUFPLG9CQUFvQjtBQUFBLEtBQzlDLG9DQUFDLHdCQUFELFFBRUYsb0NBQUMsYUFBRCxRQUdELGdCQUFnQjtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=

import * as yup from 'yup';

function maxDigitsAfterDecimal(
  this: yup.NumberSchema,
  maxDigits: number,
  message?: yup.TestConfig['message'],
) {
  return this.test(
    'maxDigitsAfterDecimal',
    message ??
      ` "number field must have ${maxDigits} digits after decimal or less",`,
    (value = 0) => Number.isInteger(value * 10 ** maxDigits),
  );
}

yup.addMethod(yup.number, 'maxDigits', maxDigitsAfterDecimal);

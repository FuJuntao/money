import * as yup from 'yup';

function maxDigitsAfterDecimal(
  this: yup.NumberSchema,
  maxDigits: number,
  message?: yup.TestConfig['message'],
) {
  return this.test(
    'maxDigitsAfterDecimal',
    message ?? `\${path} must have ${maxDigits} digits or less after decimal`,
    (value = 0) => Number.isInteger(value * 10 ** maxDigits),
  );
}

yup.addMethod(yup.number, 'maxDigits', maxDigitsAfterDecimal);

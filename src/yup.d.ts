import * as yup from 'yup';

declare module 'yup' {
  interface NumberSchema {
    maxDigits: (maxDigits: number, message?: yup.TestConfig['message']) => this;
  }
}

export * from 'yup';

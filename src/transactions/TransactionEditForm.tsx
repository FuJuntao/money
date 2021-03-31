import { NumberInputField, NumberInput, ModalBody } from '@chakra-ui/react';
import { FormikConfig, FormikProps, FormikProvider, useFormik } from 'formik';
import React, { ReactNode, useMemo } from 'react';
import * as yup from 'yup';
import FormikFormControl from '../components/FormikFormControl';

interface Values {
  amount: string;
}

interface TransactionEditFormProps {
  initialValues?: Partial<Values>;
  renderActions?: (formik: FormikProps<Values>) => ReactNode;
  onSubmit: FormikConfig<Values>['onSubmit'];
}

const validationSchema = yup.object({
  amount: yup.number().label('Amount').required().moreThan(0),
});

export default function TransactionEditForm(props: TransactionEditFormProps) {
  const { initialValues: initialValuesProp, renderActions, onSubmit } = props;

  const initialValues = useMemo(
    () => ({ amount: initialValuesProp?.amount ?? '' }),
    [initialValuesProp?.amount],
  );

  const formik = useFormik<Values>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <FormikProvider value={formik}>
      <ModalBody>
        <FormikFormControl<Values['amount']> id="amount">
          {(props) => (
            <NumberInput
              {...props}
              min={0}
              precision={2}
              onChange={(valueAsString) =>
                formik.setFieldValue('amount', valueAsString)
              }
            >
              <NumberInputField placeholder="Amount" />
            </NumberInput>
          )}
        </FormikFormControl>
      </ModalBody>

      {renderActions?.(formik)}
    </FormikProvider>
  );
}

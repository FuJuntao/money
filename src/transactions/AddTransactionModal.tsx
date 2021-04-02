import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import React from 'react';
import TransactionEditForm from './TransactionEditForm';

interface AddTransactionModalContentProps {}

function AddTransactionModalContent() {
  const handleSubmitForm = () => {};

  return (
    <ModalContent>
      <ModalHeader>Transaction</ModalHeader>
      <ModalCloseButton />
      <TransactionEditForm
        renderActions={(formik) => (
          <ModalFooter>
            <Button type="submit" isLoading={formik.isSubmitting}>
              Add
            </Button>
          </ModalFooter>
        )}
        onSubmit={handleSubmitForm}
      />
    </ModalContent>
  );
}

type AddTransactionModalProps = Omit<ModalProps, 'children'> &
  AddTransactionModalContentProps;

function AddTransactionModal(props: AddTransactionModalProps) {
  const { ...otherProps } = props;

  return (
    <Modal {...otherProps}>
      <ModalOverlay />
      <AddTransactionModalContent />
    </Modal>
  );
}

export default AddTransactionModal;

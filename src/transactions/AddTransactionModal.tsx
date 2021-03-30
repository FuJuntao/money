import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import React from 'react';

interface AddTransactionModalContentProps {}

function AddTransactionModalContent() {
  return (
    <ModalContent>
      <ModalHeader>Transaction</ModalHeader>
      <ModalCloseButton />
      form
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

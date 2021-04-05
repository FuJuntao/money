import { AddIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import AddTransactionModal from './AddTransactionModal';

export default function TransactionsList() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Box>
      <Flex justifyContent="flex-end">
        <IconButton
          aria-label="Create account"
          onClick={onOpen}
          icon={<AddIcon />}
        />
      </Flex>

      <AddTransactionModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={onClose}
      />
    </Box>
  );
}

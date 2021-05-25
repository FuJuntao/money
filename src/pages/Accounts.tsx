import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import AccountList from '../accounts/AccountList';
import CreateAccountModal from '../accounts/CreateAccountModal';

export default function Accounts() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Flex justifyContent="flex-end">
        <IconButton
          aria-label="Create account"
          onClick={onOpen}
          icon={<AddIcon />}
        />
      </Flex>

      <Divider my="4" />

      <AccountList />

      <CreateAccountModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={onClose}
      />
    </Box>
  );
}

import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import { deleteAccount } from '../database/accounts/deleteAccount';
import type { AccountType, AccountWithID } from '../database/accounts/types';
import type { ID } from '../database/MoneyDB';
import { useMutation } from '../hooks/useMutation';
import UpdateAccountModal from './UpdateAccountModal';

export const accountTypeTitle: Record<AccountType, string> = {
  asset: 'Asset',
  credit_card: 'Credit Card',
  payment_account: 'Payment Account',
};

interface AccountDeleteIconButtonProps {
  id: ID;
}

function AccountDeleteIconButton(props: AccountDeleteIconButtonProps) {
  const toast = useToast();
  const { id } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate, isLoading } = useMutation(deleteAccount);

  const handleDelete = async () => {
    await mutate({ id });
    toast({
      title: `Account successfully deleted`,
      status: 'success',
      isClosable: true,
    });
  };

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <IconButton
          variant="ghost"
          aria-label="Delete account"
          icon={<DeleteIcon />}
        />
      </PopoverTrigger>

      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>Are you sure you want to delete this account?</PopoverBody>
        <PopoverFooter display="flex" justifyContent="space-between">
          <Button isLoading={isLoading} onClick={handleDelete}>
            Yes!
          </Button>
          <Button onClick={onClose}>No!</Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

interface AccountUpdateIconButtonProps {
  account: AccountWithID;
}

function AccountUpdateIconButton(props: AccountUpdateIconButtonProps) {
  const { account } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        variant="ghost"
        aria-label="Update account"
        icon={<EditIcon />}
        onClick={() => onOpen()}
      />

      <UpdateAccountModal
        isOpen={isOpen}
        onClose={onClose}
        account={account}
        onSuccess={onClose}
      />
    </>
  );
}

interface AccountListItemProps {
  account: AccountWithID;
}

export default function AccountListItem(props: AccountListItemProps) {
  const { account } = props;
  const { name, type } = account;

  return (
    <Box>
      <Flex alignItems="center">
        <Heading as="h3">{name}</Heading>

        <Badge>{accountTypeTitle[type]}</Badge>

        <AccountUpdateIconButton account={account} />

        <AccountDeleteIconButton id={account.id} />
      </Flex>
    </Box>
  );
}

import { Button, Container, Input, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import type { Account } from 'src/graphql-schemas/generatedTypes';
import { useMutation } from '../hooks/useMutation';

interface AddAccountMutationResult {
  addAccount: Account;
}

interface AddAccountMutationVariables {
  input: { name: string };
}

interface AddAccountProps {
  onSuccess?: (account: Account) => void;
}

export default function AddAccount(props: AddAccountProps) {
  const toast = useToast();
  const { onSuccess } = props;
  const [name, setName] = useState('');

  const { mutate, isLoading } = useMutation<
    AddAccountMutationResult,
    AddAccountMutationVariables
  >(
    `
      mutation AddAccount($input: AddAccountInput!) {
        addAccount(input: $input) {
          id
          name
        }
      }
    `,
  );

  const handleSubmit = async () => {
    const { data, errors } = await mutate({ input: { name } });
    if (!errors && data?.addAccount) {
      toast({
        title: `Account '${data?.addAccount.name}' successfully created`,
        status: 'success',
        isClosable: true,
      });
      if (onSuccess) onSuccess(data.addAccount);
    }
  };

  return (
    <Container>
      <Input
        placeholder="Account name"
        value={name}
        onChange={({ target: { value } }) => setName(value)}
      />
      <Button isLoading={isLoading} onClick={handleSubmit}>
        Create new account
      </Button>
    </Container>
  );
}

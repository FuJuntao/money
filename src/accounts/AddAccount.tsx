import { Button, Container, Input, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import type { Account } from 'src/graphql-schemas/generatedTypes';
import { useMutation } from '../hooks/useMutation';

export default function AddAccount() {
  const toast = useToast();
  const [name, setName] = useState('');

  const { mutate, isLoading } = useMutation<
    { addAccount: Account },
    { name: string }
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
    if (!errors) {
      toast({
        title: `Account '${data?.addAccount.name}' successfully created`,
        status: 'success',
        isClosable: true,
      });
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

import { AddIcon } from '@chakra-ui/icons';
import {
  Container,
  Divider,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import { useQuery } from '../hooks/useQuery';

interface ResultData {
  accounts: { id: string; name: string }[];
}

export default function AccountList() {
  const { data, isLoading } = useQuery<ResultData>('{ accounts { id name } }');

  return (
    <Container>
      <Flex justifyContent="space-between">
        <Heading>Accounts</Heading>
        <IconButton
          colorScheme="blue"
          aria-label="Create account"
          icon={<AddIcon />}
        />
      </Flex>

      <Divider />

      {isLoading ? (
        <Spinner />
      ) : (
        <Stack>
          {data?.accounts.map((account) => (
            <Heading key={account.id} as="h3">
              {account.name}
            </Heading>
          ))}
        </Stack>
      )}
    </Container>
  );
}

import { AddIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import { db } from '../../database/MoneyDB';
import CreateTagModal from '../../tags/CreateTagModal';

export default function Tags() {
  const tags = useLiveQuery(() => db.tags.toArray());
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="outline"
        />
        <MenuList>
          <MenuItem icon={<AddIcon />} onClick={onOpen}>
            New Tag
          </MenuItem>
        </MenuList>
      </Menu>

      <CreateTagModal isOpen={isOpen} onClose={onClose} onSuccess={onClose} />

      <Skeleton isLoaded={!!tags}>
        <Stack divider={<StackDivider borderColor="gray.200" />}>
          {tags?.map(({ id, name }) => (
            <Text key={id}>{name}</Text>
          ))}
        </Stack>
      </Skeleton>
    </Box>
  );
}

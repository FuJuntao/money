import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  StackDivider,
  VStack,
} from '@chakra-ui/react';
import { exportDB } from 'dexie-export-import';
import React from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { db } from '../database/MoneyDB';
import Accounts from './Accounts';
import Tags from './Tags';
import Transactions from './Transactions';
import dayjs from 'dayjs';

function Breadcrumb() {
  const { pathname } = useLocation();
  const baseUrl = import.meta.env.SNOWPACK_PUBLIC_BASE_URL;
  const pathnameExcludeBaseUrl = !!baseUrl
    ? pathname.slice(pathname.indexOf(baseUrl) + (baseUrl?.length ?? 0))
    : pathname;

  return (
    <ChakraBreadcrumb>
      {(pathnameExcludeBaseUrl === '/' ? '' : pathnameExcludeBaseUrl)
        .split('/')
        .map((path, index, paths) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink
              as={Link}
              to={paths.slice(0, index + 1).join('/')}
              isCurrentPage={index === paths.length - 1}
              textTransform="capitalize"
            >
              {path === '' ? 'home' : path}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
    </ChakraBreadcrumb>
  );
}

function downloadBlob(blob: Blob, filename: string = '') {
  const anchor = document.createElement('a');
  anchor.download = filename;
  anchor.href = URL.createObjectURL(blob);
  anchor.click();
}

const settingsMenuList = [
  { to: 'accounts', children: 'Accounts' },
  { to: 'tags', children: 'Tags' },
];

const dbOptionsMenuList = [
  {
    children: 'Import DB',
  },
  {
    children: 'Export DB',
    onClick: async () => {
      // TODO:
      const data = await exportDB(db);
      downloadBlob(data, `moneyDB-v${db.verno}-${dayjs().valueOf()}.json`);
    },
  },
];

export default function Homepage() {
  const menu = (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
      />
      <MenuList>
        {settingsMenuList.map(({ to, children }) => (
          <MenuItem key={to} as={Link} to={to}>
            {children}
          </MenuItem>
        ))}
        {dbOptionsMenuList.map(({ onClick, children }) => (
          <MenuItem key={children} onClick={onClick}>
            {children}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );

  const header = (
    <Flex
      as="header"
      px="2"
      pt="2"
      justifyContent="space-between"
      alignItems="center"
    >
      <Breadcrumb />
      {menu}
    </Flex>
  );

  const routes = (
    <Routes>
      <Route path="/" element={<Transactions />} />
      <Route path="accounts" element={<Accounts />} />
      <Route path="tags" element={<Tags />} />
    </Routes>
  );

  return (
    <VStack
      h="full"
      divider={<StackDivider borderColor="gray.200" />}
      spacing={2}
      align="stretch"
    >
      {header}
      {routes}
    </VStack>
  );
}

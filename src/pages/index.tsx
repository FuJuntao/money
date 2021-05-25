import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Accounts from './Accounts';
import Tags from './Tags';
import Transactions from './Transactions';

function Breadcrumb() {
  const { pathname } = useLocation();
  const hasBaseUrl = !!import.meta.env.SNOWPACK_PUBLIC_BASE_URL;
  const pathnameExcludeBaseUrl = hasBaseUrl
    ? pathname.slice(
        pathname.indexOf(import.meta.env.SNOWPACK_PUBLIC_BASE_URL) +
          import.meta.env.SNOWPACK_PUBLIC_BASE_URL?.length,
      )
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

const settingsMenuList = [
  { to: 'accounts', children: 'Accounts' },
  { to: 'tags', children: 'Tags' },
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
      </MenuList>
    </Menu>
  );

  const location = useLocation();
  console.log('file: index.tsx ~ line 46 ~ Homepage ~ location', location);

  return (
    <Box>
      {menu}
      <Breadcrumb />

      <Routes>
        <Route path="/" element={<Transactions />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="tags" element={<Tags />} />
      </Routes>
    </Box>
  );
}

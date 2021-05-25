import React from 'react';
import { useRoutes } from 'react-router-dom';
import Accounts from './Accounts';
import Tags from './Tags';

function Settings() {
  return useRoutes([
    { path: '/', element: null },
    { path: 'accounts', element: <Accounts /> },
    { path: 'tags', element: <Tags /> },
  ]);
}

export default Settings;

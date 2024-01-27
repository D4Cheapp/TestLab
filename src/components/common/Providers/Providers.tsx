'use client';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/src/reduxjs';

interface Props {
  children: React.ReactNode;
}

function Providers({ children }: Props): React.ReactNode {
  return <Provider store={store}>{children}</Provider>;
}

export default Providers;

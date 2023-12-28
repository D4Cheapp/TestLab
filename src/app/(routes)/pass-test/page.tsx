import React from 'react';
import { Authentication } from '@/src/components';
import { PassTestPage } from '@/src/components/PassTestPage';

function PassTest(): React.ReactNode {
  return (
    <Authentication isAdmin={false}>
      <PassTestPage />
    </Authentication>
  );
}

export default PassTest;

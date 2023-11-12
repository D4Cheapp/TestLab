import React from 'react';
import { Authentication } from '@/src/components';

function PassTest(): React.ReactNode {
  return (
    <Authentication isAdmin={false}>
      <div>pass-test</div>
    </Authentication>
  );
}

export default PassTest;

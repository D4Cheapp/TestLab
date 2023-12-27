import React from 'react';
import { Authentication } from '@/src/components';
import PassTestComponent from '../../../components/PassTestComponent/PassTestComponent';

function PassTest(): React.ReactNode {
  return (
    <Authentication isAdmin={false}>
      <PassTestComponent />
    </Authentication>
  );
}

export default PassTest;

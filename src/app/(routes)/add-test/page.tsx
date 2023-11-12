import React from 'react';
import { Authentication } from '@/src/components';

function AddTest(): React.ReactNode {
  return (
    <Authentication isAdmin={true}>
      <div>add test</div>
    </Authentication>
  );
}

export default AddTest;

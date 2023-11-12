import React from 'react';
import { Authentication } from '@/src/components';

function DeleteTest(): React.ReactNode {
  return (
    <Authentication isAdmin={true}>
      <div>delete page</div>
    </Authentication>
  );
}

export default DeleteTest;

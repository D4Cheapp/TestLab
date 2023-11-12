import React from 'react';
import { Authentication } from '@/src/components';

function EditTest(): React.ReactNode {
  return (
    <Authentication isAdmin={true}>
      <div>edit test</div>
    </Authentication>
  );
}

export default EditTest;

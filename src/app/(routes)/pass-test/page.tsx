import React from 'react';
import Authentication from '@/src/components/common/Authentication';
import PassTestPage from '@/src/components/pages/PassTestPage';

function PassTest(): React.ReactNode {
  return (
    <Authentication isAdmin={false}>
      <PassTestPage />
    </Authentication>
  );
}

export default PassTest;

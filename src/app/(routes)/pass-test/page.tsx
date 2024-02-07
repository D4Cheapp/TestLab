import React from 'react';
import Authentication from '@/src/components/common/Authentication';
import PassTestPage from '@/src/components/pages/PassTestPage';

const PassTest = (): React.ReactNode => {
  return (
    <Authentication isAdmin={false}>
      <PassTestPage />
    </Authentication>
  );
};

export default PassTest;

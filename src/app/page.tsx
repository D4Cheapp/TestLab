import React from 'react';
import Authentication from '../components/common/Authentication';
import Home from '../components/pages/Home';

const HomePage = (): React.ReactNode => {
  return (
    <Authentication isAdmin={false}>
      <Home />
    </Authentication>
  );
};

export default HomePage;

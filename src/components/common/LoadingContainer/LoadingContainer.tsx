import React from 'react';
import s from './LoadingContainer.module.scss';

const LoadingContainer = (): React.ReactNode => {
  return (
    <div className={s.root}>
      <div className={s.loading} />
    </div>
  );
};

export default LoadingContainer;

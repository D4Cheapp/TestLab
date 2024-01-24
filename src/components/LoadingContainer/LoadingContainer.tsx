import React from 'react';
import s from './LoadingContainer.module.scss';

function LoadingContainer(): React.ReactNode {
  return (
    <div className={s.root}>
      <div className={s.loading} />
    </div>
  );
}

export default LoadingContainer;

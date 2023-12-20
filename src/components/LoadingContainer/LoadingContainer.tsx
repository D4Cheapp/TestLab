import React from 'react';
import styles from './LoadingContainer.module.scss';

function LoadingContainer(): React.ReactNode {
  return (
    <div className={styles.root}>
      <div className={styles.loading} />
    </div>
  );
}

export default LoadingContainer;

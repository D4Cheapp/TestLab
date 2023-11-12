import React from 'react';

import styles from './ErrorMessage.module.scss';

interface ErrorMessageInterface {
  error: string;
  index: number;
  onCloseClick: (index: number) => void;
}

function ErrorMessage({
  error,
  index,
  onCloseClick,
}: ErrorMessageInterface): null | React.ReactNode {
  return (
    <div className={styles.errorMessage}>
      <p className={styles.error}>{error}</p>
      <button className={styles.close} onClick={() => onCloseClick(index)} />
    </div>
  );
}

export default ErrorMessage;

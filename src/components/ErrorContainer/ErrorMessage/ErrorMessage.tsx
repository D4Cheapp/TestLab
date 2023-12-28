import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useAppDispatch } from '@/src/hooks/reduxHooks';
import { deleteErrorState } from '@/src/reduxjs/reducers/baseReducer';
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
  const [isFaded, setIsFaded] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFaded(true), 3500);
    const timer = setTimeout(() => dispatch(deleteErrorState(index)), 4000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(timer);
    };
  }, [dispatch, index]);

  return (
    <div className={clsx(styles.errorMessage, { [styles.fadeAnimation]: isFaded })}>
      <p className={styles.error}>{error}</p>
      <button className={styles.close} onClick={() => onCloseClick(index)} />
    </div>
  );
}

export default ErrorMessage;

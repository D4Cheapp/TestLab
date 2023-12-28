import React, { useEffect } from 'react';
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(deleteErrorState(index)), 4000);
    return () => clearTimeout(timer);
  }, [dispatch, index]);

  return (
    <div className={styles.errorMessage}>
      <p className={styles.error}>{error}</p>
      <button className={styles.close} onClick={() => onCloseClick(index)} />
    </div>
  );
}

export default ErrorMessage;

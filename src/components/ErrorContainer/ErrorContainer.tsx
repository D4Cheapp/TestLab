'use client';
import React, { useCallback, useEffect } from 'react';
import { deleteErrorState } from "@/src/reduxjs/reducers/testReducer";
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { ErrorMessage } from './ErrorMessage';
import styles from './ErrorContainer.module.scss';

function ErrorContainer(): React.ReactNode {
  const errorsState = useAppSelector((state) => state.test.errors);
  const dispatch = useAppDispatch();

  const onCloseClick = useCallback(
    (index: number) => dispatch(deleteErrorState(index)),
    [dispatch],
  );

  useEffect(() => {
    if (errorsState.length > 0) {
      const timer = setTimeout(() => onCloseClick(errorsState.length - 1), 5000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, errorsState.length, onCloseClick]);

  if (errorsState.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {errorsState.map((error, index) => (
        <ErrorMessage key={index} error={error} index={index} onCloseClick={onCloseClick} />
      ))}
    </div>
  );
}

export default ErrorContainer;

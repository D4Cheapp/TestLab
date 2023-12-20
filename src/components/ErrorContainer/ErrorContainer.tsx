'use client';
import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { deleteErrorState } from '@/src/reduxjs/reducers/baseReducer';
import { ErrorMessage } from './ErrorMessage';
import styles from './ErrorContainer.module.scss';

function ErrorContainer(): React.ReactNode {
  const errorsState = useAppSelector((state) => state.base.errors);
  const isErrorsEmpty = errorsState.length === 0;
  const dispatch = useAppDispatch();

  const onCloseClick = useCallback(
    (index: number) => dispatch(deleteErrorState(index)),
    [dispatch],
  );

  useEffect(() => {
    if (!isErrorsEmpty) {
      const timer = setTimeout(() => onCloseClick(errorsState.length - 1), 5000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, errorsState.length, isErrorsEmpty, onCloseClick]);

  if (isErrorsEmpty) {
    return null;
  }

  return (
    <div className={styles.container}>
      {errorsState.map((error, index) => (
        <ErrorMessage
          key={index}
          error={error}
          index={index}
          onCloseClick={onCloseClick}
        />
      ))}
    </div>
  );
}

export default ErrorContainer;

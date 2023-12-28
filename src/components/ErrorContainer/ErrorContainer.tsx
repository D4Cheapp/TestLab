'use client';
import React, { useCallback } from 'react';
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

  if (isErrorsEmpty) {
    return null;
  }

  return (
    <div className={styles.container}>
      {errorsState.map((error) => (
        <ErrorMessage
          key={error.id}
          error={error.error}
          index={error.id}
          onCloseClick={onCloseClick}
        />
      ))}
    </div>
  );
}

export default ErrorContainer;

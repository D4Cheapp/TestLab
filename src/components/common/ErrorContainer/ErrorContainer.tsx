'use client';
import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { deleteErrorState } from '@/src/reduxjs/reducers/baseReducer';
import s from './ErrorContainer.module.scss';
import ErrorMessage from './ErrorMessage';

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
    <div className={s.container}>
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

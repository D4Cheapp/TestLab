import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useAppDispatch } from '@/src/hooks/reduxHooks';
import { deleteErrorState } from '@/src/reduxjs/reducers/baseReducer';
import s from './ErrorMessage.module.scss';

interface Props {
  error: string;
  index: number;
  onCloseClick: (index: number) => void;
}

function ErrorMessage({ error, index, onCloseClick }: Props): null | React.ReactNode {
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
    <div className={clsx(s.errorMessage, { [s.fadeAnimation]: isFaded })}>
      <p className={s.error}>{error}</p>
      <button className={s.close} onClick={() => onCloseClick(index)} />
    </div>
  );
}

export default ErrorMessage;

'use client';
import React, { useCallback } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Authentication } from '@/src/components';
import { TestForm } from '@/src/components/TestForm';
import { useAppDispatch } from '@/src/hooks/reduxHooks';
import { testFormType } from '@/src/types/formTypes';
import { setErrorsState } from '@/src/reduxjs/reducers/baseReducer';
import { createTest } from '@/src/reduxjs/reducers/testReducer';

function AddTest(): React.ReactNode {
  const dispatch = useAppDispatch();

  const addTestAction: SubmitHandler<testFormType> = useCallback(
    (data, event) => {
      event?.preventDefault();

      if (!data.title.trim()) {
        dispatch(setErrorsState('Ошибка: Поле названия теста должно быть заполнено'));
        return false;
      }

      dispatch(createTest({ title: data.title }));
      return false;
    },
    [dispatch],
  );

  return (
    <Authentication isAdmin>
      <TestForm action={addTestAction} title="Добавление теста" />
    </Authentication>
  );
}

export default AddTest;

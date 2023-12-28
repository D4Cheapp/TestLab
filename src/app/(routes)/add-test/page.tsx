'use client';
import React, { useCallback, useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Authentication } from '@/src/components';
import { TestForm } from '@/src/components/TestForm';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { testFormType } from '@/src/types/formTypes';
import { setErrorsState, setModalWindowState } from '@/src/reduxjs/reducers/baseReducer';
import { setTest } from '@/src/reduxjs/reducers/testReducer';
import { LoadingContainer } from '@/src/components/LoadingContainer';

function AddTest(): React.ReactNode {
  const isLoading = useAppSelector((state) => state.base.loadingState);
  const dispatch = useAppDispatch();

  const addTestAction: SubmitHandler<testFormType> = useCallback(
    (data, event) => {
      event?.preventDefault();
      const isTitleFilled = data.title && data.title.trim();

      if (!isTitleFilled) {
        return dispatch(setErrorsState('Error: Test title should not be empty'));
      }

      dispatch(
        setModalWindowState({
          title: 'Сохранить созданный тест?',
          buttons: {
            save: { saveTarget: 'test', title: data.title.replace(/\s+/gm, ' ').trim() },
            withConfirmButton: true,
          },
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(setTest(undefined));
  }, [dispatch]);

  return (
    <Authentication isAdmin>
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <TestForm action={addTestAction} title="Добавление теста" />
      )}
    </Authentication>
  );
}

export default AddTest;

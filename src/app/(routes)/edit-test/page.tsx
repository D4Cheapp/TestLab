'use client';
import React, { useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { Authentication } from '@/src/components';
import { TestForm } from '@/src/components/TestForm';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { testFormType } from '@/src/types/formTypes';
import { setErrorsState, setModalWindowState } from '@/src/reduxjs/reducers/baseReducer';
import { getTest } from '@/src/reduxjs/reducers/testReducer';
import { LoadingContainer } from '@/src/components/LoadingContainer';

function EditTest(): React.ReactNode {
  const searchParams = useSearchParams().get('id');
  const isLoading = useAppSelector((state) => state.base.loadingState);
  const initTest = useAppSelector((state) => state.test.currentTest);
  const dispatch = useAppDispatch();
  const testId = searchParams ? +searchParams : undefined;

  const saveTestAction: SubmitHandler<testFormType> = useCallback(
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
            save: { saveTarget: 'test', title: data.title, id: testId },
            withConfirmButton: true,
          },
        }),
      );
    },
    [dispatch, testId],
  );

  useEffect(() => {
    if (testId !== undefined) {
      dispatch(getTest({ id: testId }));
    }
  }, [dispatch, testId]);

  return (
    <Authentication isAdmin>
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <TestForm
          initTest={initTest}
          action={saveTestAction}
          title="Редактирование теста"
        />
      )}
    </Authentication>
  );
}

export default EditTest;

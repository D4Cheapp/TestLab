'use client';
import React, { useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { Authentication } from '@/src/components';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { getTest } from '@/src/reduxjs/reducers/testReducer';
import { TestForm } from '@/src/components/TestForm';
import { testFormType } from '@/src/types/formTypes';
import { setErrorsState, setModalWindowState } from '@/src/reduxjs/reducers/baseReducer';
import { LoadingContainer } from '@/src/components/LoadingContainer';

function DeleteTest(): React.ReactNode {
  const searchParams = useSearchParams().get('id');
  const initTest = useAppSelector((state) => state.test.currentTest);
  const isLoading = useAppSelector((state) => state.base.loadingState);
  const dispatch = useAppDispatch();
  const testId = searchParams ? +searchParams : undefined;

  const deleteTestAction: SubmitHandler<testFormType> = useCallback(
    (data, event) => {
      event?.preventDefault();
      if (testId) {
        dispatch(
          setModalWindowState({
            title: 'Вы действительно хотите удалить тест?',
            buttons: {
              delete: { deleteTarget: 'test', id: testId },
              withConfirmButton: true,
            },
          }),
        );
      } else {
        dispatch(setErrorsState('Error: Cannot find test to delete'));
      }
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
          action={deleteTestAction}
          title="Удаление теста"
          withDeleteButton
        />
      )}
    </Authentication>
  );
}

export default DeleteTest;

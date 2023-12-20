'use client';
import React, { useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { Authentication } from '@/src/components';
import { TestForm } from '@/src/components/TestForm';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { testFormType } from '@/src/types/formTypes';
import { setModalWindowState } from '@/src/reduxjs/reducers/baseReducer';
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
      dispatch(setModalWindowState(undefined));
    },
    [dispatch],
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

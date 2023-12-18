'use client';
import React, { useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Authentication } from '@/src/components';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { getTest } from '@/src/reduxjs/reducers/testReducer';
import { TestForm } from '@/src/components/TestForm';

function DeleteTest(): React.ReactNode {
  const questions = useAppSelector((state) => state.modalWindow.currentTest)?.questions;
  const searchParams = useSearchParams().get('id');
  const dispatch = useAppDispatch();
  const testId = searchParams ? +searchParams : undefined;

  const deleteTestAction = useCallback(() => {}, []);

  useEffect(() => {
    if (testId !== undefined) {
      dispatch(getTest({ id: testId }));
    }
  }, [dispatch, testId]);

  return (
    <Authentication isAdmin>
      <TestForm
        action={deleteTestAction}
        initialQuestions={questions}
        title="Удаление теста"
        withDeleteButton
      />
    </Authentication>
  );

}

export default DeleteTest;

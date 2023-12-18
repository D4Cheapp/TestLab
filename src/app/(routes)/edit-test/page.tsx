'use client';
import React, { useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { Authentication } from '@/src/components';
import { TestForm } from '@/src/components/TestForm';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { testFormType } from '@/src/types/formTypes';
import { setModalWindowState } from '@/src/reduxjs/reducers/modalWindowReducer';
import { getTest } from '@/src/reduxjs/reducers/testReducer';

function EditTest(): React.ReactNode {
  const questions = useAppSelector((state) => state.modalWindow.currentTest)?.questions;
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const testId = searchParams ? +searchParams : undefined;

  const saveTestAction:SubmitHandler<testFormType> = useCallback((data, event) => {
    event?.preventDefault();
    dispatch(setModalWindowState(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (testId !== undefined) {
      dispatch(getTest({ id: testId }));
    }
  }, [dispatch, testId]);

  return (
    <Authentication isAdmin>
      <TestForm
        action={saveTestAction}
        initialQuestions={questions}
        title="Редактирование теста"
      />
    </Authentication>
  );
}

export default EditTest;

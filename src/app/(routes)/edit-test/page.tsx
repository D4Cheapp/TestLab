'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { Authentication } from '@/src/components';
import { TestForm } from '@/src/components/TestForm';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { testFormType } from '@/src/types/formTypes';
import { setErrorsState } from '@/src/reduxjs/reducers/baseReducer';
import { editTest, getTest, setCurrentTest } from '@/src/reduxjs/reducers/testReducer';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ModalWindow } from '@/src/components/ModalWindow';

function EditTest(): React.ReactNode {
  const isLoading = useAppSelector((state) => state.base.loadingState);
  const initTest = useAppSelector((state) => state.test.currentTest);
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams().get('id');
  const router = useRouter();

  const [isConfirmWindowActive, setIsConfirmWindowActive] = useState(false);
  const [testTitle, setTestTitle] = useState<string>();

  const testId = searchParams ? +searchParams : undefined;

  const saveTestAction: SubmitHandler<testFormType> = useCallback(
    (data, event) => {
      event?.preventDefault();
      const isTitleFilled = data.title && data.title.trim();
      const isNotEnoughQuestions =
        !initTest?.questions || initTest?.questions?.length === 0;

      if (!isTitleFilled) {
        return dispatch(setErrorsState('Error: Test title should not be empty'));
      }

      if (isNotEnoughQuestions) {
        return dispatch(
          setErrorsState('Error: Test should contain at least one question'),
        );
      }

      if (!testId) {
        return dispatch(setErrorsState('Error: Cannot find test to edit'));
      }

      setTestTitle(data.title.replace(/\s+/gm, ' ').trim());
      setIsConfirmWindowActive(true);
    },
    [dispatch, initTest?.questions, testId],
  );

  const saveTestConfirm = useCallback(() => {
    const isTestCorrect = testId && testTitle;

    if (isTestCorrect) {
      dispatch(editTest({ title: testTitle, id: testId }));
      dispatch(setCurrentTest(undefined));
      setIsConfirmWindowActive(false);
      router.push('/');
    }
  }, [dispatch, router, testId, testTitle]);

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
        <>
          {isConfirmWindowActive && (
            <ModalWindow
              title="Сохранить измененный тест?"
              setIsActive={setIsConfirmWindowActive}
              confirmAction={saveTestConfirm}
              buttonInfo={{ withConfirmButton: true, confirmTitle: 'Сохранить' }}
            />
          )}
          <TestForm
            initTest={initTest}
            action={saveTestAction}
            title="Редактирование теста"
          />
        </>
      )}
    </Authentication>
  );
}

export default EditTest;

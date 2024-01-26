'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Authentication } from '@/src/components';
import { TestForm } from '@/src/components/TestForm';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { TestFormType } from '@/src/types/formTypes';
import { setErrorsState } from '@/src/reduxjs/reducers/baseReducer';
import { createTest, setCurrentTest } from '@/src/reduxjs/reducers/testReducer';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ModalWindow } from '@/src/components/ModalWindow';
import { CreateQuestionRequestType } from '@/src/types/requestTypes';

function AddTest(): React.ReactNode {
  const isLoading = useAppSelector((state) => state.base.loadingState);
  const currentTest = useAppSelector((state) => state.test.currentTest);
  const dispatch = useAppDispatch();

  const [isConfirmWindowActive, setIsConfirmWindowActive] = useState(false);
  const [testInfo, setTestInfo] = useState<{
    title: string;
    questions: CreateQuestionRequestType[];
  }>();
  const router = useRouter();

  const addTestAction: SubmitHandler<TestFormType> = useCallback(
    (data, event) => {
      event?.preventDefault();
      const isTitleFilled = data.title && data.title.trim();
      const isNotEnoughQuestions =
        !currentTest?.questions || currentTest?.questions?.length === 0;

      if (!isTitleFilled) {
        return dispatch(setErrorsState('Error: Test title should not be empty'));
      }

      if (isNotEnoughQuestions) {
        return dispatch(
          setErrorsState('Error: Test should contain at least one question'),
        );
      }

      if (currentTest?.questions) {
        setTestInfo({
          title: data.title.replace(/\s+/gm, ' ').trim(),
          questions: currentTest?.questions,
        });
        setIsConfirmWindowActive(true);
      }
    },
    [currentTest?.questions, dispatch],
  );

  const saveTestConfirm = useCallback(() => {
    if (testInfo) {
      dispatch(createTest(testInfo));
      dispatch(setCurrentTest(undefined));
      setIsConfirmWindowActive(false);
      router.push('/');
    }
  }, [dispatch, router, testInfo]);

  useEffect(() => {
    dispatch(setCurrentTest(undefined));
  }, [dispatch]);

  return (
    <Authentication isAdmin>
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <>
          {isConfirmWindowActive && (
            <ModalWindow
              title="Сохранить созданный тест?"
              setIsActive={setIsConfirmWindowActive}
              confirmAction={saveTestConfirm}
              buttonInfo={{ withConfirmButton: true }}
            />
          )}
          <TestForm action={addTestAction} title="Добавление теста" />
        </>
      )}
    </Authentication>
  );
}

export default AddTest;

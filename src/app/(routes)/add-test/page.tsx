'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useActions, useAppSelector } from '@/src/hooks/reduxHooks';
import { TestFormType } from '@/src/types/formTypes';
import { CreateQuestionRequestType } from '@/src/types/requestTypes';
import Authentication from '@/src/components/common/Authentication';
import TestForm from '@/src/components/pages/TestForm';
import ModalWindow from '@/src/components/common/ModalWindow';
import LoadingContainer from '@/src/components/common/LoadingContainer';
import { loadingStateSelector } from '@/src/reduxjs/base/selectors';
import { currentTestSelector } from '@/src/reduxjs/test/selectors';

function AddTest(): React.ReactNode {
  const isLoading = useAppSelector(loadingStateSelector);
  const currentTest = useAppSelector(currentTestSelector);
  const { setErrorsState, createTest, setCurrentTest } = useActions();
  const router = useRouter();
  const [isConfirmWindowActive, setIsConfirmWindowActive] = useState(false);
  const [testInfo, setTestInfo] = useState<{
    title: string;
    questions: CreateQuestionRequestType[];
  }>();

  const addTestAction: SubmitHandler<TestFormType> = useCallback(
    (data, event) => {
      event?.preventDefault();
      const isTitleFilled = data.title && data.title.trim();
      const isNotEnoughQuestions =
        !currentTest?.questions || currentTest?.questions?.length === 0;

      if (!isTitleFilled) {
        return setErrorsState('Error: Test title should not be empty');
      }
      if (isNotEnoughQuestions) {
        return setErrorsState('Error: Test should contain at least one question');
      }
      if (currentTest?.questions) {
        setTestInfo({
          title: data.title.replace(/\s+/gm, ' ').trim(),
          questions: currentTest?.questions,
        });
        setIsConfirmWindowActive(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTest?.questions],
  );

  const saveTestConfirm = useCallback(() => {
    if (testInfo) {
      createTest(testInfo);
      setCurrentTest(undefined);
      setIsConfirmWindowActive(false);
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, testInfo]);

  useEffect(() => {
    setCurrentTest(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

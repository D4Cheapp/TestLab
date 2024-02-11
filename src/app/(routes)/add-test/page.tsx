'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik } from 'formik';
import { useActions, useAppSelector } from '@/src/hooks/reduxHooks';
import { TestFormType } from '@/src/types/formTypes';
import { CreateQuestionRequestType } from '@/src/types/requestTypes';
import Authentication from '@/src/components/common/Authentication';
import TestForm from '@/src/components/pages/TestForm';
import ModalWindow from '@/src/components/common/ModalWindow';
import LoadingContainer from '@/src/components/common/LoadingContainer';
import { loadingStateSelector } from '@/src/reduxjs/base/selectors';
import { currentTestSelector } from '@/src/reduxjs/test/selectors';
import { testFormInitialValues, testFormValidation } from '@/src/components/pages/TestForm/TestFormFormik';

const AddTest = (): React.ReactNode => {
  const isLoading = useAppSelector(loadingStateSelector);
  const currentTest = useAppSelector(currentTestSelector);
  const { setErrorsState, createTest, setCurrentTest } = useActions();
  const router = useRouter();
  const [isConfirmWindowActive, setIsConfirmWindowActive] = useState(false);
  const [testInfo, setTestInfo] = useState<{
    title: string;
    questions: CreateQuestionRequestType[];
  }>();

  const handleAddTestAction = (values: TestFormType): void => {
    const isNotEnoughQuestions = !currentTest?.questions || currentTest?.questions?.length === 0;
    if (isNotEnoughQuestions) {
      setErrorsState('Error: Test should contain at least one question');
      return;
    }
    if (currentTest?.questions) {
      setTestInfo({
        title: values.testTitle.replace(/\s+/gm, ' ').trim(),
        questions: currentTest?.questions,
      });
      setIsConfirmWindowActive(true);
    }
  };

  const handleSaveTestConfirmClick = useCallback(() => {
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
              onConfirmClick={handleSaveTestConfirmClick}
              buttonInfo={{ withConfirmButton: true }}
            />
          )}
          <Formik
            initialValues={testFormInitialValues}
            onSubmit={handleAddTestAction}
            validationSchema={testFormValidation}
          >
            <TestForm title="Добавление теста" />
          </Formik>
        </>
      )}
    </Authentication>
  );
};

export default AddTest;

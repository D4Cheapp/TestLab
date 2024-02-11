'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Formik } from 'formik';
import { useActions, useAppSelector } from '@/src/hooks/reduxHooks';
import { TestFormType } from '@/src/types/formTypes';
import Authentication from '@/src/components/common/Authentication';
import TestForm from '@/src/components/pages/TestForm';
import ModalWindow from '@/src/components/common/ModalWindow';
import LoadingContainer from '@/src/components/common/LoadingContainer';
import { loadingStateSelector } from '@/src/reduxjs/base/selectors';
import { currentTestSelector } from '@/src/reduxjs/test/selectors';
import {
  testFormInitialValues,
  testFormValidation,
} from '@/src/components/pages/TestForm/TestFormFormik';

const EditTest = (): React.ReactNode => {
  const isLoading = useAppSelector(loadingStateSelector);
  const initTest = useAppSelector(currentTestSelector);
  const { setErrorsState, getTest, setCurrentTest, editTest } = useActions();
  const searchParams = useSearchParams().get('id');
  const router = useRouter();
  const [isConfirmWindowActive, setIsConfirmWindowActive] = useState(false);
  const [testTitle, setTestTitle] = useState<string>();
  const testId = searchParams ? +searchParams : undefined;

  const handleSaveTestAction = (values: TestFormType): void => {
    const isNotEnoughQuestions = !initTest?.questions || initTest?.questions?.length === 0;
    if (isNotEnoughQuestions) {
      setErrorsState('Error: Test should contain at least one question');
      return;
    }
    if (!testId) {
      setErrorsState('Error: Cannot find test to edit');
      return;
    }
    setTestTitle(values.testTitle.replace(/\s+/gm, ' ').trim());
    setIsConfirmWindowActive(true);
  };

  const handleSaveTestConfirmClick = useCallback(() => {
    const isTestCorrect = testId && testTitle;
    if (isTestCorrect) {
      editTest({ title: testTitle, id: testId });
      setCurrentTest(undefined);
      setIsConfirmWindowActive(false);
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, testId, testTitle]);

  useEffect(() => {
    if (testId !== undefined) {
      getTest({ id: testId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

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
              onConfirmClick={handleSaveTestConfirmClick}
              buttonInfo={{ withConfirmButton: true, confirmTitle: 'Сохранить' }}
            />
          )}
          <Formik
            initialValues={{
              ...testFormInitialValues,
              testTitle: initTest?.title === undefined ? '' : initTest.title,
            }}
            validationSchema={testFormValidation}
            onSubmit={handleSaveTestAction}
          >
            <TestForm initTest={initTest} title="Редактирование теста" />
          </Formik>
        </>
      )}
    </Authentication>
  );
};

export default EditTest;

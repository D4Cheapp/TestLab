'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useActions, useAppSelector } from '@/src/hooks/reduxHooks';
import Authentication from '@/src/components/common/Authentication';
import TestForm from '@/src/components/pages/TestForm';
import ModalWindow from '@/src/components/common/ModalWindow';
import LoadingContainer from '@/src/components/common/LoadingContainer';
import { currentTestSelector } from '@/src/reduxjs/test/selectors';
import { loadingStateSelector } from '@/src/reduxjs/base/selectors';
import { testFormInitialValues, testFormValidation } from '@/src/components/pages/TestForm/TestFormFormik';

const DeleteTest = (): React.ReactNode => {
  const initTest = useAppSelector(currentTestSelector);
  const isLoading = useAppSelector(loadingStateSelector);
  const { setErrorsState, deleteTest, getTest, setCurrentTest } = useActions();
  const searchParams = useSearchParams().get('id');
  const router = useRouter();
  const [isConfirmWindowActive, setIsConfirmWindowActive] = useState(false);
  const testId = searchParams ? +searchParams : undefined;

  const handleDeleteTestAction = () => {
    if (testId) {
      setIsConfirmWindowActive(true);
    } else {
      setErrorsState('Error: Cannot find test to delete');
    }
  };

  const handleDeleteTestConfirmClick = useCallback(() => {
    if (testId) {
      deleteTest({ id: testId });
      router.push('/');
      setCurrentTest(undefined);
      setIsConfirmWindowActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, testId]);

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
              title="Вы действительно хотите удалить тест?"
              setIsActive={setIsConfirmWindowActive}
              onConfirmClick={handleDeleteTestConfirmClick}
              buttonInfo={{ withConfirmButton: true, confirmTitle: 'Удалить' }}
            />
          )}
          <Formik
            initialValues={{
              ...testFormInitialValues,
              testTitle: initTest?.title === undefined ? '' : initTest.title,
            }}
            validationSchema={testFormValidation}
            onSubmit={handleDeleteTestAction}
          >
            <TestForm initTest={initTest} title="Удаление теста" withDeleteButton />
          </Formik>
        </>
      )}
    </Authentication>
  );
};

export default DeleteTest;

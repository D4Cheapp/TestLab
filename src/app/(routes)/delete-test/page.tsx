'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { deleteTest, getTest, setCurrentTest } from '@/src/reduxjs/reducers/testReducer';
import { TestFormType } from '@/src/types/formTypes';
import { setErrorsState } from '@/src/reduxjs/reducers/baseReducer';
import Authentication from '@/src/components/common/Authentication';
import TestForm from '@/src/components/pages/TestForm';
import ModalWindow from '@/src/components/common/ModalWindow';
import LoadingContainer from '@/src/components/common/LoadingContainer';

function DeleteTest(): React.ReactNode {
  const initTest = useAppSelector((state) => state.test.currentTest);
  const isLoading = useAppSelector((state) => state.base.loadingState);
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams().get('id');
  const router = useRouter();

  const [isConfirmWindowActive, setIsConfirmWindowActive] = useState(false);
  const testId = searchParams ? +searchParams : undefined;

  const deleteTestAction: SubmitHandler<TestFormType> = useCallback(
    (data, event) => {
      event?.preventDefault();
      if (testId) {
        setIsConfirmWindowActive(true);
      } else {
        dispatch(setErrorsState('Error: Cannot find test to delete'));
      }
    },
    [dispatch, testId],
  );

  const deleteTestConfirm = useCallback(() => {
    if (testId) {
      dispatch(deleteTest({ id: testId }));
      router.push('/');
      dispatch(setCurrentTest(undefined));
      setIsConfirmWindowActive(false);
    }
  }, [dispatch, router, testId]);

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
              title="Вы действительно хотите удалить тест?"
              setIsActive={setIsConfirmWindowActive}
              confirmAction={deleteTestConfirm}
              buttonInfo={{ withConfirmButton: true, confirmTitle: 'Удалить' }}
            />
          )}
          <TestForm
            initTest={initTest}
            action={deleteTestAction}
            title="Удаление теста"
            withDeleteButton
          />
        </>
      )}
    </Authentication>
  );
}

export default DeleteTest;

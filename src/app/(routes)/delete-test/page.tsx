'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useActions, useAppSelector } from '@/src/hooks/reduxHooks';
import { TestFormType } from '@/src/types/formTypes';
import Authentication from '@/src/components/common/Authentication';
import TestForm from '@/src/components/pages/TestForm';
import ModalWindow from '@/src/components/common/ModalWindow';
import LoadingContainer from '@/src/components/common/LoadingContainer';
import { currentTestSelector } from '@/src/reduxjs/test/selectors';
import { loadingStateSelector } from '@/src/reduxjs/base/selectors';

function DeleteTest(): React.ReactNode {
  const initTest = useAppSelector(currentTestSelector);
  const isLoading = useAppSelector(loadingStateSelector);
  const { setErrorsState, deleteTest, getTest, setCurrentTest } = useActions();

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
        setErrorsState('Error: Cannot find test to delete');
      }
    },
    [setErrorsState, testId],
  );

  const deleteTestConfirm = useCallback(() => {
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

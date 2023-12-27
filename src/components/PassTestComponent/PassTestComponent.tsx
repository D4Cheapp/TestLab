'use client';
import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { getTest } from '@/src/reduxjs/reducers/testReducer';
import styles from './PassTestComponent.module.scss';
import { PassQuestion } from './PassQuestion';

interface PassTestComponentInterface {}

function PassTestComponent({}: PassTestComponentInterface): React.ReactNode {
  const searchParams = useSearchParams().get('id');
  const currentTest = useAppSelector((state) => state.test.currentTest);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onPassTestClick = () => {};

  const onGoBackClick = () => {
    router.push('/');
  };

  useEffect(() => {
    const isIdExists = searchParams && searchParams !== null;
    if (isIdExists) {
      dispatch(getTest({ id: +searchParams }));
    }
  }, [dispatch, searchParams]);

  if (!currentTest) {
    return null;
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.testTitle}>{currentTest?.title}</h1>
      <section className={styles.questionsContainer}>
        {currentTest.questions?.map((question) => (
          <PassQuestion key={question.id} question={question} />
        ))}
      </section>
      <div className={styles.buttonsContainer}>
        <button
          className={clsx(styles.passTestButton, styles.testButton)}
          onClick={onPassTestClick}
        >
          Сдать тест
        </button>

        <button
          className={clsx(styles.goBackButton, styles.testButton)}
          onClick={onGoBackClick}
        >
          Назад
        </button>
      </div>
    </div>
  );
}

export default PassTestComponent;

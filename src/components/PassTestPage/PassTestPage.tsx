'use client';
import React, { MouseEvent, ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { getTest } from '@/src/reduxjs/reducers/testReducer';
import { setErrorsState, setModalWindowState } from '@/src/reduxjs/reducers/baseReducer';
import styles from './PassTestPage.module.scss';
import { PassQuestion } from './PassQuestion';

type passTestQuestionType =
  | {
      answer?: number;
      answers?: (number | undefined)[];
    }[]
  | undefined;

function PassTestPage(): React.ReactNode {
  const searchParams = useSearchParams().get('id');
  const currentTest = useAppSelector((state) => state.test.currentTest);
  const [passProgress, setPassProgress] = useState<passTestQuestionType>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onAddAnswerClick = useCallback(
    (
      event: MouseEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
      questionIndex: number,
      answerId?: number,
    ) => {
      const isQuestionExists =
        currentTest?.questions && currentTest?.questions[questionIndex] && passProgress;
      if (isQuestionExists) {
        //@ts-ignore
        const questionType = currentTest?.questions[questionIndex].question_type;
        const currentQuestion = passProgress[questionIndex];
        const currentProgress = Array.from(passProgress);

        switch (questionType) {
          case 'multiple':
            const answerCheck = (event.target as HTMLInputElement).checked;
            let answers = [];
            if (answerCheck) {
              answers =
                currentQuestion.answers === undefined
                  ? [answerId]
                  : [...currentQuestion.answers, answerId];
            } else {
              //@ts-ignore
              answers = currentQuestion?.answers.filter((ansId) => ansId !== answerId);
            }
            currentProgress[questionIndex].answers = answers;
            setPassProgress(currentProgress);
            break;

          case 'single':
            currentProgress[questionIndex].answers = [answerId];
            setPassProgress(currentProgress);
            break;

          case 'number':
            const target = (event?.target as HTMLInputElement).value;
            const answer = target === '' ? undefined : +target;
            currentProgress[questionIndex].answer = answer;
            setPassProgress(currentProgress);
            break;
        }
      }
    },
    [currentTest?.questions, passProgress],
  );

  const onPassTestClick = () => {
    const isReadyToPass = currentTest?.questions && passProgress;
    if (isReadyToPass) {
      const correctQuestions = currentTest?.questions;
      //@ts-ignore
      const score = correctQuestions.reduce((accumulator, correctQuestion, index) => {
        const isErrorInReduce = accumulator === -1;
        if (isErrorInReduce) {
          return -1;
        }

        const currentQuestion = passProgress[index];
        const questionType = correctQuestion.question_type;
        const isAnswerExists =
          currentQuestion.answer === undefined && currentQuestion.answers === undefined;

        if (isAnswerExists) {
          dispatch(setErrorsState('Error: Fill out all the answers to the questions'));
          return -1;
        }

        switch (questionType) {
          case 'multiple':
            const isNotEnoughQuestions =
              currentQuestion.answers && currentQuestion?.answers?.length < 2;

            if (isNotEnoughQuestions) {
              dispatch(
                setErrorsState(
                  'Error: There cannot be less than 2 correct answers in the multiple question',
                ),
              );
              return -1;
            }
            const correctAnswers = correctQuestion.answers?.filter((ans) => ans.is_right);
            const currentAnswers = currentQuestion.answers;
            const isCorrectMultiAnswer =
              correctAnswers?.length === currentAnswers?.length &&
              currentAnswers?.every(
                (ans, index) => correctAnswers && ans === correctAnswers[index].id,
              );

            if (isCorrectMultiAnswer) {
              return accumulator + 1;
            }
            break;

          case 'single':
            const correctAnswer = correctQuestion.answers?.filter(
              (ans) => ans.is_right,
            )[0];
            const isCorrectSingleAnswer =
              currentQuestion?.answers &&
              correctAnswer?.id === currentQuestion?.answers[0];
            if (isCorrectSingleAnswer) {
              return accumulator + 1;
            }
            break;

          case 'number':
            const isCorrectNumberAnswer =
              correctQuestion.answer === currentQuestion.answer;
            if (isCorrectNumberAnswer) {
              return accumulator + 1;
            }
            break;
        }

        return accumulator;
      }, 0);

      const isScoreCorrupted = score !== -1;
      if (isScoreCorrupted) {
        dispatch(
          setModalWindowState({
            title: 'Результаты прохождения теста',
            content: {
              type: 'test-result',
              correct: score,
              //@ts-ignore
              wrong: correctQuestions.length - score,
            },
            buttons: {
              withGoToTestButton: true,
            },
          }),
        );
      }
    }
  };

  const onGoBackClick = () => {
    router.push('/');
  };

  useEffect(() => {
    const isCurrentTestExists = currentTest?.questions;
    if (isCurrentTestExists) {
      const clearProgress = Array.from(Array(currentTest.questions?.length), () => {
        return {};
      });
      setPassProgress(clearProgress);
    }
  }, [currentTest]);

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
        {currentTest.questions?.map((question, index) => (
          <PassQuestion
            key={question.id}
            question={question}
            questionIndex={index}
            onAddAnswerClick={onAddAnswerClick}
          />
        ))}
      </section>
      <div className={styles.buttonsContainer}>
        <button
          className={clsx(styles.passTestButton, styles.testButton)}
          onClick={onPassTestClick}
        >
          Закончить прохождение теста
        </button>

        <button
          className={clsx(styles.goBackButton, styles.testButton)}
          onClick={onGoBackClick}
        >
          Вернуться к списку тестов
        </button>
      </div>
    </div>
  );
}

export default PassTestPage;

'use client';
import React, { MouseEvent, ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { getTest } from '@/src/reduxjs/reducers/testReducer';
import { setErrorsState, setModalWindowState } from '@/src/reduxjs/reducers/baseReducer';
import styles from './PassTestComponent.module.scss';
import { PassQuestion } from './PassQuestion';

type passTestQuestionType =
  | {
      questionId?: number;
      questionType: 'single' | 'multiple' | 'number';
      answer?: number;
      answers?: (number | undefined)[];
    }[]
  | undefined;

function PassTestComponent(): React.ReactNode {
  const searchParams = useSearchParams().get('id');
  const currentTest = useAppSelector((state) => state.test.currentTest);
  const [passProgress, setPassProgress] = useState<passTestQuestionType>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onAddAnswerClick = useCallback(
    (
      event: MouseEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
      questionId?: number,
      answerId?: number,
    ) => {
      setPassProgress(
        passProgress?.map((question) => {
          const isCurrentQuestion = question.questionId === questionId;

          if (isCurrentQuestion) {
            switch (question.questionType) {
              case 'multiple':
                const answerCheck = (event.target as HTMLInputElement).checked;
                if (answerCheck) {
                  const answers =
                    question.answers === undefined
                      ? [answerId]
                      : [...question.answers, answerId];
                  return { ...question, answers };
                } else {
                  //@ts-ignore
                  const answers = question?.answers.filter((ansId) => ansId !== answerId);
                  return { ...question, answers };
                }

              case 'single':
                return { ...question, answers: [answerId] };

              case 'number':
                const target = (event?.target as HTMLInputElement).value;
                const answer = target === '' ? undefined : +target;
                return { ...question, answer };
            }
          } else {
            return question;
          }
        }),
      );
    },
    [passProgress],
  );

  const onPassTestClick = () => {
    if (currentTest?.questions && passProgress) {
      const correctQuestions = currentTest?.questions;

      const score = correctQuestions.reduce((accumulator, correctQuestion, index) => {
        if (accumulator === -1) {
          return -1;
        }

        const currentQuestion = passProgress[index];
        const questionType = currentQuestion.questionType;
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
            const isCorrectMultiAnswer = currentQuestion.answers?.every(
              //@ts-ignore
              (ans) => correctAnswers?.includes(ans),
            );
            if (isCorrectMultiAnswer) {
              return accumulator + 1;
            }

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

          case 'number':
            const isCorrectNumberAnswer =
              correctQuestion.answer === currentQuestion.answer;
            if (isCorrectNumberAnswer) {
              return accumulator + 1;
            }
        }

        return accumulator;
      }, 0);

      if (score !== -1) {
        dispatch(
          setModalWindowState({
            title: 'Результаты прохождения теста',
            content: {
              type: 'test-result',
              correct: score,
              wrong: correctQuestions.length,
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
    const passQuestionsState = currentTest?.questions?.map((question) => {
      return { questionId: question.id, questionType: question.question_type };
    });
    setPassProgress(passQuestionsState);
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
        {currentTest.questions?.map((question) => (
          <PassQuestion
            key={question.id}
            question={question}
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

export default PassTestComponent;

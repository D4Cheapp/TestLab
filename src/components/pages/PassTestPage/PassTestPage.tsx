'use client';
import React, { MouseEvent, ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import classNames from 'classnames';
import { useActions, useAppSelector } from '@/src/hooks/reduxHooks';
import { currentTestSelector } from '@/src/reduxjs/test/selectors';
import ModalWindow from '../../common/ModalWindow';
import PassQuestion from './PassQuestion';
import s from './PassTestPage.module.scss';

type PassTestQuestionType =
  | {
      correct?: boolean;
      answer?: number;
      answers?: (number | undefined)[];
    }[]
  | undefined;

function PassTestPage(): React.ReactNode {
  const searchParams = useSearchParams().get('id');
  const currentTest = useAppSelector(currentTestSelector);
  const [passProgress, setPassProgress] = useState<PassTestQuestionType>([]);
  const [isResultWindowActive, setIsResultWindowActive] = useState(false);
  const [testResult, setTestResult] = useState<{ correct: number; wrong: number }>();
  const router = useRouter();
  const { setErrorsState, getTest } = useActions();

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
        const currentProgress = structuredClone(passProgress);

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
            break;

          case 'single':
            currentProgress[questionIndex].answers = [answerId];
            break;

          case 'number':
            const target = (event?.target as HTMLInputElement).value;
            const answer = target === '' ? undefined : +target;
            currentProgress[questionIndex].answer = answer;
            break;
        }
        setPassProgress(currentProgress);
      }
    },
    [currentTest?.questions, passProgress],
  );

  const onPassTestClick = () => {
    const isReadyToPass = currentTest?.questions && passProgress;
    if (isReadyToPass) {
      const correctQuestions = currentTest?.questions;
      const newProgress = structuredClone(passProgress);
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
          setErrorsState('Error: Fill out all the answers to the questions');
          return -1;
        }

        switch (questionType) {
          case 'multiple':
            const isNotEnoughQuestions =
              currentQuestion.answers && currentQuestion?.answers?.length < 2;

            if (isNotEnoughQuestions) {
              setErrorsState(
                'Error: There cannot be less than 2 correct answers in the multiple question',
              );
              return -1;
            }
            const correctAnswers = correctQuestion.answers?.filter((ans) => ans.is_right);
            const currentAnswers = currentQuestion.answers?.sort();

            const isCorrectMultiAnswer =
              correctAnswers?.length === currentAnswers?.length &&
              currentAnswers?.every(
                (ans, index) => correctAnswers && ans === correctAnswers[index].id,
              );

            newProgress[index].correct = isCorrectMultiAnswer;
            return isCorrectMultiAnswer ? accumulator + 1 : accumulator;

          case 'single':
            const correctAnswer = correctQuestion.answers?.filter(
              (ans) => ans.is_right,
            )[0];
            const isCorrectSingleAnswer =
              currentQuestion?.answers &&
              correctAnswer?.id === currentQuestion?.answers[0];

            newProgress[index].correct = isCorrectSingleAnswer;
            return isCorrectSingleAnswer ? accumulator + 1 : accumulator;

          case 'number':
            const isCorrectNumberAnswer =
              correctQuestion.answer === currentQuestion.answer;
            newProgress[index].correct = isCorrectNumberAnswer;
            return isCorrectNumberAnswer ? accumulator + 1 : accumulator;
        }
      }, 0);

      const isScoreCorrupted = score !== -1;
      if (isScoreCorrupted) {
        setPassProgress(newProgress);
        //@ts-ignore
        setTestResult({ correct: score, wrong: correctQuestions?.length - score });
        setIsResultWindowActive(true);
      }
    }
  };

  const onGoBackClick = () => {
    router.push('/');
  };

  const goBackConfirmAction = () => {
    onGoBackClick();
    setIsResultWindowActive(false);
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
      getTest({ id: +searchParams });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (!currentTest?.questions) {
    return null;
  }

  return (
    <div className={s.root}>
      <h1 className={s.testTitle}>{currentTest?.title}</h1>
      <section className={s.questionsContainer}>
        {currentTest.questions?.map((question, index) => (
          <PassQuestion
            key={question.id}
            question={question}
            questionIndex={index}
            onAddAnswerClick={onAddAnswerClick}
            isCorrect={passProgress && passProgress[index]?.correct}
          />
        ))}
      </section>
      <div className={s.buttonsContainer}>
        {isResultWindowActive && (
          <ModalWindow
            buttonInfo={{
              confirmTitle: 'Вернуться к списку тестов',
              withConfirmButton: true,
            }}
            confirmAction={goBackConfirmAction}
            setIsActive={setIsResultWindowActive}
            title={'Результаты прохождения теста'}
          >
            <div className={s.resultContainer}>
              <p className={s.resultTitle}>
                Всего вопросов: {currentTest.questions.length}
              </p>
              <p className={s.resultTitle}>Правильных ответов: {testResult?.correct} </p>
              <p className={s.resultTitle}>Неправильных ответов: {testResult?.wrong}</p>
            </div>
          </ModalWindow>
        )}
        <button
          className={classNames(s.passTestButton, s.testButton)}
          onClick={onPassTestClick}
        >
          Закончить прохождение теста
        </button>

        <button className={classNames(s.goBackButton, s.testButton)} onClick={onGoBackClick}>
          Вернуться к списку тестов
        </button>
      </div>
    </div>
  );
}

export default PassTestPage;

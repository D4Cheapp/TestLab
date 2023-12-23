'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import {
  addLocalQuestion,
  createQuestion,
  createTest,
  deleteAnswer,
  deleteLocalQuestion,
  deleteQuestion,
  deleteTest,
  editLocalQuestion,
  editQuestion,
  getTest,
  setCurrentQuestion,
} from '@/src/reduxjs/reducers/testReducer';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { setErrorsState, setModalWindowState } from '@/src/reduxjs/reducers/baseReducer';
import { ModalWindowContext, questionAnswerType } from './ModalWindowContext';
import { ModalButtons, ModalContent } from './components';
import styles from './ModalWindow.module.scss';

function ModalWindow(): React.ReactNode {
  const currentQuestion = useAppSelector((state) => state.test.currentQuestion);
  const currentTest = useAppSelector((state) => state.test.currentTest);
  const windowData = useAppSelector((state) => state.base.modalWindow);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [answers, setAnswers] = useState<questionAnswerType[]>([]);
  const [draggableAnswer, setDraggableAnswer] = useState<questionAnswerType | null>(null);

  const answerInputRef = useRef<HTMLInputElement>(null);
  const numberAnswerRef = useRef<HTMLInputElement>(null);
  const questionTitleRef = useRef<HTMLInputElement>(null);

  const isLocal = windowData?.content?.type === 'question' && windowData.content.isLocal;
  const isVisibleContent =
    windowData?.content?.type === 'question' ||
    windowData?.content?.type === 'test-result';
  const title = currentQuestion?.question.title;
  const currentQuestionNumberAnswer =
    currentQuestion?.question.question_type === 'number'
      ? currentQuestion.question.answer
      : undefined;

  const onCloseWindowClick = useCallback(() => {
    dispatch(setModalWindowState(undefined));
    dispatch(setCurrentQuestion(undefined));
  }, [dispatch]);

  const onEscapeKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseWindowClick();
      }
    },
    [onCloseWindowClick],
  );

  const onInputCheck = useCallback(
    (id: number) => {
      const changedAnswers = answers.map((answer, index) => {
        return index === id
          ? {
              id: answer.id,
              text: answer.text,
              is_right: !answer.is_right,
              order: answer.order,
            }
          : answer;
      });
      setAnswers(changedAnswers);
    },
    [answers],
  );

  const onGoToTestListClick = useCallback(() => router.push('/'), [router]);

  const onConfirmClick = useCallback(() => {
    const isDeleteButton = windowData?.buttons && windowData.buttons.delete;
    const isTestPass =
      windowData?.content?.type === 'test-pass' && windowData?.content?.id;
    const isTestSave =
      windowData?.buttons?.save?.saveTarget === 'test' &&
      windowData?.buttons?.save?.title;

    if (isDeleteButton) {
      const target = windowData?.buttons?.delete?.deleteTarget;
      const deleteId = windowData.buttons?.delete?.id
        ? windowData.buttons?.delete?.id
        : 0;

      if (target === 'question') {
        dispatch(
          isLocal
            ? deleteLocalQuestion({ id: deleteId })
            : deleteQuestion({ id: deleteId, test_id: currentTest?.id }),
        );
        return dispatch(setModalWindowState(undefined));
      }

      if (target === 'test') {
        dispatch(deleteTest({ id: deleteId }));
        router.push('/');
        return dispatch(setModalWindowState(undefined));
      }
    }

    if (isTestPass) {
      //@ts-ignore
      router.push(`/pass-test?id=${+windowData.content?.id}`);
      return dispatch(setModalWindowState(undefined));
    }

    if (isTestSave) {
      dispatch(
        createTest({
          //@ts-ignore
          title: windowData.buttons?.save?.title,
          questions: currentTest?.questions,
        }),
      );

      onCloseWindowClick();
      return router.push('/');
    }
  }, [
    currentTest?.id,
    currentTest?.questions,
    dispatch,
    isLocal,
    onCloseWindowClick,
    router,
    windowData?.buttons,
    windowData?.content,
  ]);

  const questionValidation = (
    title: string | undefined,
    questionType: 'number' | 'multiple' | 'single',
    checkedAnswerCount: number | undefined,
  ): boolean => {
    const isTitleEmpty = !title?.trim();
    const isMultiplyCheckNotCorrect =
      questionType === 'multiple' && (!checkedAnswerCount || checkedAnswerCount < 2);
    const isNumberQuestion =
      questionType === 'number' && numberAnswerRef.current?.value === undefined;

    if (isTitleEmpty) {
      dispatch(setErrorsState('Error: Enter a question'));
      return false;
    }

    if (isMultiplyCheckNotCorrect) {
      dispatch(
        setErrorsState(
          !checkedAnswerCount
            ? 'Error: Question should be 1 answer option in the question'
            : 'Error: There cannot be less than 2 correct answers in the question',
        ),
      );
      return false;
    }

    if (questionType === 'single') {
      if (!checkedAnswerCount) {
        dispatch(
          setErrorsState('Error: Question should be 1 answer option in the question'),
        );
        return false;
      }

      if (checkedAnswerCount >= 2) {
        dispatch(
          setErrorsState(
            'Error: There cannot be more than 2 correct answers in the question',
          ),
        );
        return false;
      }
    }

    if (isNumberQuestion) {
      dispatch(setErrorsState('Error: Input field should not be empty'));
      return false;
    }

    return true;
  };

  const onSaveClick = useCallback(() => {
    const target = windowData?.buttons?.save?.saveTarget;
    const isQuestionSave =
      windowData &&
      target === 'question' &&
      windowData.content?.type === 'question' &&
      windowData.content?.questionType;

    if (isQuestionSave) {
      const questionTitle = questionTitleRef?.current?.value;
      //@ts-ignore
      const questionType = windowData.content?.questionType as
        | 'number'
        | 'multiple'
        | 'single';
      const checkedAnswerCount: number | undefined =
        answers.length > 1
          ? answers.reduce((counter, answer) => (counter += +answer.is_right), 0)
          : undefined;
      const numberAnswer = !!numberAnswerRef.current?.value
        ? +numberAnswerRef.current.value
        : undefined;

      if (questionValidation(questionTitle, questionType, checkedAnswerCount)) {
        //@ts-ignore
        if (isLocal) {
          const questionData = {
            id: currentQuestion?.id ?? currentTest?.questions?.length ?? 0,
            question: {
              question_type: questionType,
              title: questionTitle,
              answer: numberAnswer,
            },
            answers:
              numberAnswer !== undefined
                ? undefined
                : answers.map((answer, index) => {
                    return {
                      id: index,
                      text: answer.text,
                      is_right: answer.is_right,
                    };
                  }),
          };

          dispatch(
            windowData.isEdit
              ? //@ts-ignore
                editLocalQuestion(questionData)
              : //@ts-ignore
                addLocalQuestion(questionData),
          );
        }

        const isRequest = !isLocal && questionTitle && questionType;
        if (isRequest) {
          const testId = windowData.buttons?.save?.id;
          const questionData = {
            title: questionTitle,
            question_type: questionType,
          };

          if (numberAnswer) {
            //@ts-ignore
            questionData.answer = numberAnswer;
          } else {
            //@ts-ignore
            questionData.answers = answers.map((answer) => {
              return {
                text: answer.text,
                is_right: answer.is_right,
              };
            });
          }

          dispatch(
            windowData.isEdit && currentQuestion?.id
              ? editQuestion({ ...questionData, id: currentQuestion.id })
              : createQuestion({
                  ...questionData,
                  test_id: windowData.buttons?.save?.id,
                }),
          );

          if (testId) {
            dispatch(getTest({ id: testId }));
          }
        }
        return onCloseWindowClick();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    windowData,
    answers,
    dispatch,
    currentQuestion?.id,
    currentTest,
    onCloseWindowClick,
  ]);

  const onAddAnswerClick = useCallback(() => {
    const answerValue = answerInputRef.current?.value;

    if (answerValue) {
      setAnswers([
        ...answers,
        {
          id: answers.length,
          text: answerValue,
          is_right: false,
          order: answers.length,
        },
      ]);
      answerInputRef.current.value = '';
    } else {
      dispatch(
        setErrorsState('Error: Fill in the contents of the response before adding it'),
      );
    }
  }, [answers, dispatch, answerInputRef]);

  const onDeleteAnswerClick = useCallback(
    (answerIndex: number) => {
      if (isLocal) {
        const changedAnswers = answers.filter((value, index) => index !== answerIndex);
        setAnswers(changedAnswers);
      } else {
        dispatch(deleteAnswer({ id: answerIndex, test_id: currentTest?.id }));
      }

      onCloseWindowClick();
    },
    [answers, currentTest?.id, dispatch, isLocal, onCloseWindowClick],
  );

  const onAnswerDragStart = useCallback((answer: questionAnswerType) => {
    setDraggableAnswer(answer);
  }, []);

  const onAnswerDragEnd = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove('dragStart');
  }, []);

  const onAnswerDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.add('dragStart');
  }, []);

  const onAnswerDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>, answer: questionAnswerType) => {
      event.preventDefault();
      setAnswers(
        answers.map((mapAnswer) => {
          const isCurrentDragAnswer =
            draggableAnswer && mapAnswer.id === draggableAnswer.id;
          const isDroppedAnswer = draggableAnswer && mapAnswer.id === answer.id;

          return isDroppedAnswer || isCurrentDragAnswer
            ? {
                ...mapAnswer,
                order: isDroppedAnswer ? draggableAnswer.order : answer.order,
              }
            : mapAnswer;
        }),
      );

      event.currentTarget.classList.remove('dragStart');
      setDraggableAnswer(null);
    },
    [answers, draggableAnswer],
  );

  const dragEvents = {
    onAnswerDragStart,
    onAnswerDragEnd,
    onAnswerDragOver,
    onAnswerDrop,
  };

  const refs = {
    answerInputRef,
    numberAnswerRef,
    questionTitleRef,
  };

  const clickEvents = {
    onAddAnswerClick,
    onDeleteAnswerClick,
  };

  useEffect(() => {
    const isCurrentQuestionEmptyOrNumber =
      currentQuestion !== undefined &&
      currentQuestion.question.question_type !== 'number' &&
      currentQuestion?.answers;

    if (isCurrentQuestionEmptyOrNumber) {
      //@ts-ignore
      const changedAnswers = currentQuestion.answers.map((answer, index) => {
        return { ...answer, order: index };
      });
      setAnswers(changedAnswers);
    } else {
      setAnswers([]);
    }

    if (windowData) {
      addEventListener('keydown', onEscapeKeyDown);
      return () => removeEventListener('keydown', onEscapeKeyDown);
    }
  }, [currentQuestion, onEscapeKeyDown, windowData]);

  if (!windowData) {
    return null;
  }

  return (
    <aside className={styles.root}>
      <div className={styles.background} onClick={onCloseWindowClick} />

      <div
        className={clsx(styles.componentFrom, {
          [styles.invisibleContent]: !isVisibleContent,
        })}
      >
        <div className={styles.formHeader}>
          {windowData?.title && <h1 className={styles.title}>{windowData.title}</h1>}
          <button className={styles.closeButton} onClick={onCloseWindowClick} />
        </div>

        {isVisibleContent && windowData.content && (
          <ModalWindowContext.Provider
            value={{
              onInputCheck,
              answers,
              title,
              currentQuestionNumberAnswer,
              dragEvents,
              refs,
              clickEvents,
            }}
          >
            <ModalContent windowData={windowData} />
          </ModalWindowContext.Provider>
        )}

        <ModalButtons
          windowData={windowData}
          onGoToTestListClick={onGoToTestListClick}
          onConfirmClick={onConfirmClick}
          onSaveClick={onSaveClick}
          onCloseWindowClick={onCloseWindowClick}
        />
      </div>
    </aside>
  );
}

export default ModalWindow;

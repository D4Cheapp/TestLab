'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import {
  addLocalQuestionState,
  deleteLocalQuestionState,
  setCurrentQuestionState,
  setModalWindowState,
} from '@/src/reduxjs/reducers/modalWindowReducer';
import { createTest, deleteTest } from '@/src/reduxjs/reducers/testReducer';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { setErrorsState } from '@/src/reduxjs/reducers/baseReducer';
import { ModalWindowContext, questionAnswerType } from './ModalWindowContext';
import { ModalButtons, ModalContent } from './components';
import styles from './ModalWindow.module.scss';

function ModalWindow(): React.ReactNode {
  const currentQuestion = useAppSelector((state) => state.modalWindow.currentQuestion);
  const currentTest = useAppSelector((state) => state.modalWindow.currentTest);
  const windowData = useAppSelector((state) => state.modalWindow.modalWindow);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [answers, setAnswers] = useState<questionAnswerType[]>([]);
  const [draggableAnswer, setDraggableAnswer] = useState<questionAnswerType | null>(null);

  const answerInputRef = useRef<HTMLInputElement>(null);
  const numberAnswerRef = useRef<HTMLInputElement>(null);
  const questionTitleRef = useRef<HTMLInputElement>(null);

  const isVisibleContent =
    windowData?.content?.type === 'question' ||
    windowData?.content?.type === 'test-result';
  const title = currentQuestion?.question.title;
  const numberAnswer =
    currentQuestion?.question.question_type === 'number'
      ? +currentQuestion.answers[0].text
      : undefined;

  const onCloseWindowClick = useCallback(() => {
    dispatch(setModalWindowState(undefined));
    dispatch(setCurrentQuestionState(undefined));
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
              answer: {
                text: answer.answer.text,
                is_right: !answer.answer.is_right,
              },
              dragInfo: answer.dragInfo,
            }
          : answer;
      });
      setAnswers(changedAnswers);
    },
    [answers],
  );

  const onGoToTestListClick = useCallback(() => router.push('/'), [router]);

  const onConfirmClick = useCallback(() => {
    if (windowData?.buttons.delete) {
      const target = windowData.buttons.delete?.deleteTarget;
      const deleteId = windowData.buttons.delete?.id;

      if (target === 'question') {
        dispatch(deleteLocalQuestionState({ id: deleteId }));
      } else if (target === 'test') {
        dispatch(deleteTest({ id: deleteId }));
      }
    }
    if (windowData?.content?.type === 'test-pass') {
      router.push(`/pass-test?id=${windowData.content.id}`);
      return dispatch(setModalWindowState(undefined));
    }
  }, [dispatch, router, windowData?.buttons.delete, windowData?.content]);

  const onSaveClick = useCallback(() => {
    const target = windowData?.buttons.save?.saveTarget;
    const isQuestionSave =
      windowData &&
      target === 'question' &&
      windowData.content?.type === 'question' &&
      windowData.content?.questionType;

    if (isQuestionSave) {
      const questionTitle = questionTitleRef?.current?.value;
      const isTitleEmpty = !questionTitle?.trim();

      if (isTitleEmpty) {
        return dispatch(setErrorsState('Error: Enter a question'));
      }

      //@ts-ignore
      const questionType = windowData.content?.questionType as
        | 'number'
        | 'multiple'
        | 'single';
      const checkedAnswerCount: number | undefined =
        answers.length > 1
          ? answers.reduce((counter, answer) => (counter += +answer.answer.is_right), 0)
          : undefined;
      const isMultiplyCheckNotCorrect =
        questionType === 'multiple' && (!checkedAnswerCount || checkedAnswerCount < 2);
      const isNumberQuestion =
        questionType === 'number' && numberAnswerRef.current?.value === undefined;

      if (isMultiplyCheckNotCorrect) {
        return dispatch(
          setErrorsState(
            !checkedAnswerCount
              ? 'Error: Question should be 1 answer option in the question'
              : 'Error: There cannot be less than 2 correct answers in the question',
          ),
        );
      }

      if (questionTitle === 'single') {
        if (!checkedAnswerCount) {
          return dispatch(
            setErrorsState('Error: Question should be 1 answer option in the question'),
          );
        }

        if (checkedAnswerCount < 2) {
          return dispatch(
            setErrorsState(
              'Error: There cannot be less than 2 correct answers in the question',
            ),
          );
        }
      }

      if (isNumberQuestion) {
        return dispatch(setErrorsState('Error: Input field should not be empty'));
      }

      const isInputCorrect = questionTitleRef.current?.value && checkedAnswerCount;
      if (isInputCorrect) {
        dispatch(
          addLocalQuestionState({
            id: currentQuestion?.id,
            question: {
              question_type: questionType,
              title: questionTitleRef.current?.value,
              answer: checkedAnswerCount,
            },
            answers:
              questionType === 'number' && numberAnswerRef.current?.value
                ? [{ text: numberAnswerRef.current.value, is_right: true }]
                : answers.map((answer) => answer.answer),
            isEdit: windowData.isEdit,
          }),
        );
      }
    } else if (target === 'test') {
      const isTitleFilled = currentTest && currentTest.title && currentTest?.title.trim();
      if (!isTitleFilled) {
        return dispatch(setErrorsState('Error: Test title should not be empty'));
      }

      if (isTitleFilled) {
        dispatch(createTest({ title: currentTest.title }));
      }
    }
  }, [windowData, answers, dispatch, currentQuestion?.id, currentTest]);

  const onAddAnswerClick = useCallback(() => {
    const answerValue = answerInputRef.current?.value;

    if (answerValue) {
      setAnswers([
        ...answers,
        {
          answer: { text: answerValue, is_right: false },
          dragInfo: { id: answers.length, order: answers.length },
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
      const changedAnswers = answers.filter((value, index) => index !== answerIndex);
      setAnswers(changedAnswers);
    },
    [answers],
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
            draggableAnswer && mapAnswer.dragInfo.id === draggableAnswer.dragInfo.id;
          const isDroppedAnswer =
            draggableAnswer && mapAnswer.dragInfo.id === answer.dragInfo.id;

          return isDroppedAnswer || isCurrentDragAnswer
            ? {
                answer: mapAnswer.answer,
                dragInfo: {
                  id: mapAnswer.dragInfo.id,
                  order: isDroppedAnswer
                    ? draggableAnswer.dragInfo.order
                    : answer.dragInfo.order,
                },
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
      currentQuestion.question.question_type !== 'number';

    if (isCurrentQuestionEmptyOrNumber) {
      const changedAnswers = currentQuestion.answers.map((answer, index) => {
        return { answer: answer, dragInfo: { id: index, order: index } };
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
              numberAnswer,
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

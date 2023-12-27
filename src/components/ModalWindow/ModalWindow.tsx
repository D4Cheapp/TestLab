'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import {
  addLocalQuestion,
  createQuestion,
  createTest,
  deleteLocalQuestion,
  deleteQuestion,
  deleteTest,
  editLocalQuestion,
  editQuestion,
  editTest,
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
  const numberAnswerRef = useRef<HTMLInputElement>(null);
  const questionTitleRef = useRef<HTMLInputElement>(null);

  const isLocal = windowData?.content?.type === 'question' && windowData.content.isLocal;
  const isVisibleContent =
    windowData?.content?.type === 'question' ||
    windowData?.content?.type === 'test-result';
  const title = currentQuestion?.title;
  const currentQuestionNumberAnswer =
    currentQuestion?.question_type === 'number' ? currentQuestion.answer : undefined;

  const onCloseWindowClick = useCallback(() => {
    setAnswers([]);
    dispatch(setCurrentQuestion(undefined));
    dispatch(setModalWindowState(undefined));
  }, [dispatch]);

  const onEscapeKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isEscapePressed = event.key === 'Escape';
      if (isEscapePressed) {
        onCloseWindowClick();
      }
    },
    [onCloseWindowClick],
  );

  const onGoToTestListClick = useCallback(() => router.push('/'), [router]);

  const onConfirmClick = useCallback(() => {
    const isDeleteConfirm =
      windowData?.buttons?.delete &&
      windowData.buttons.delete?.deleteTarget &&
      windowData.buttons.delete.id;
    const isTestPassConfirm =
      windowData?.content?.type === 'test-pass' && windowData?.content?.id;
    const isTestSaveConfirm =
      windowData?.buttons?.save?.saveTarget === 'test' &&
      windowData?.buttons?.save?.title;

    if (isDeleteConfirm) {
      //@ts-ignore
      const deleteTarget = windowData.buttons.delete.deleteTarget;
      //@ts-ignore
      const deleteId = windowData.buttons.delete.id;

      if (deleteTarget === 'question') {
        dispatch(
          isLocal
            ? deleteLocalQuestion({ id: deleteId })
            : deleteQuestion({ id: deleteId, test_id: currentTest?.id }),
        );
      }

      if (deleteTarget === 'test') {
        dispatch(deleteTest({ id: deleteId }));
        router.push('/');
      }

      return onCloseWindowClick();
    }

    if (isTestPassConfirm) {
      //@ts-ignore
      router.push(`/pass-test?id=${+windowData.content.id}`);
      return onCloseWindowClick();
    }

    if (isTestSaveConfirm) {
      //@ts-ignore
      const title: string = windowData.buttons.save.title;
      const questions = currentTest?.questions;
      const isTestEdit = windowData.isEdit && currentTest?.id;

      dispatch(
        isTestEdit
          ? //@ts-ignore
            editTest({ title, id: currentTest?.id })
          : createTest({ title, questions }),
      );

      onCloseWindowClick();
      return router.push('/');
    }
  }, [dispatch, onCloseWindowClick, router, isLocal, currentTest, windowData]);

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

    if (isNumberQuestion) {
      dispatch(setErrorsState('Error: Input field should not be empty'));
      return false;
    }

    return true;
  };

  const onSaveQuestionClick = useCallback(() => {
    const target = windowData?.buttons?.save?.saveTarget;
    const isQuestionSave =
      windowData &&
      target === 'question' &&
      windowData.content?.type === 'question' &&
      windowData.content?.questionType;

    if (!isQuestionSave) {
      return;
    }

    const title = questionTitleRef?.current?.value;
    //@ts-ignore
    const question_type = windowData.content?.questionType as
      | 'number'
      | 'multiple'
      | 'single';
    const checkedAnswerCount: number | undefined = answers
      ? answers.reduce((counter, answer) => (counter += +answer.is_right), 0)
      : undefined;
    const numberAnswer =
      numberAnswerRef.current?.value !== undefined
        ? +numberAnswerRef.current.value
        : undefined;

    if (questionValidation(title, question_type, checkedAnswerCount)) {
      const isServerQuestion = !isLocal && title && question_type;

      if (!isServerQuestion) {
        const questionData = {
          id: windowData.isEdit && currentQuestion ? currentQuestion.id : Date.now(),
          question_type,
          title,
          isQuestionLocal: true,
          answer: numberAnswer,
          answers: answers ?? undefined,
        };

        dispatch(
          windowData.isEdit
            ? //@ts-ignore
              editLocalQuestion(questionData)
            : //@ts-ignore
              addLocalQuestion(questionData),
        );
      }

      if (isServerQuestion) {
        const test_id = currentTest?.id;
        const isEdit = windowData.isEdit && currentQuestion?.id;
        const questionData = {
          title,
          question_type,
          isQuestionLocal: currentQuestion?.isQuestionLocal,
          answer: numberAnswer,
          answers: answers ?? undefined,
          test_id,
        };

        dispatch(
          isEdit
            ? editQuestion({
                ...questionData,
                //@ts-ignore
                id: currentQuestion.id,
              })
            : createQuestion(questionData),
        );
      }
      return onCloseWindowClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    answers,
    isLocal,
    windowData,
    currentQuestion,
    currentTest?.id,
    dispatch,
    onCloseWindowClick,
  ]);

  const refs = {
    numberAnswerRef,
    questionTitleRef,
  };

  useEffect(() => {
    if (windowData) {
      addEventListener('keydown', onEscapeKeyDown);
      return () => removeEventListener('keydown', onEscapeKeyDown);
    }
  }, [onEscapeKeyDown, windowData]);

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
              refs,
              title,
              answers,
              setAnswers,
              currentQuestionNumberAnswer,
            }}
          >
            <ModalContent windowData={windowData} />
          </ModalWindowContext.Provider>
        )}

        <ModalButtons
          windowData={windowData}
          onGoToTestListClick={onGoToTestListClick}
          onConfirmClick={onConfirmClick}
          onSaveQuestionClick={onSaveQuestionClick}
          onCloseWindowClick={onCloseWindowClick}
        />
      </div>
    </aside>
  );
}

export default ModalWindow;

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
  const [draggableAnswer, setDraggableAnswer] = useState<questionAnswerType | null>(null);

  const answerInputRef = useRef<HTMLInputElement>(null);
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
    dispatch(setModalWindowState(undefined));
    dispatch(setCurrentQuestion(undefined));
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
  }, [
    dispatch,
    onCloseWindowClick,
    router,
    isLocal,
    currentTest?.id,
    windowData?.isEdit,
    windowData?.content,
    windowData?.buttons,
    currentTest?.questions,
  ]);

  const onAnswerCheckClick = useCallback(
    (id: number) => {
      const changedAnswers = answers.map((answer) =>
        answer.id === id
          ? {
              ...answer,
              is_right: !answer?.is_right,
              isLocalInfo: true,
            }
          : answer,
      );
      setAnswers(changedAnswers);
    },
    [answers],
  );

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

  const onSaveQuestionClick = useCallback(() => {
    const target = windowData?.buttons?.save?.saveTarget;
    const isQuestionSave =
      windowData &&
      target === 'question' &&
      windowData.content?.type === 'question' &&
      windowData.content?.questionType;

    if (isQuestionSave) {
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
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    onCloseWindowClick,
    answers,
    windowData,
    currentTest,
    currentQuestion?.id,
  ]);

  const onAddAnswerClick = useCallback(() => {
    const answerValue = answerInputRef.current?.value;

    if (answerValue) {
      setAnswers([
        ...answers,
        {
          id: Date.now(),
          text: answerValue,
          is_right: false,
          position: answers.length,
          isCreated: true,
        },
      ]);
      answerInputRef.current.value = '';
    } else {
      dispatch(
        setErrorsState('Error: Fill in the contents of the response before adding it'),
      );
    }
  }, [answers, dispatch]);

  const onDeleteAnswerClick = useCallback(
    (answerId: number) => {
      const changedAnswers = answers.map((ans) =>
        ans.id === answerId ? { ...ans, isDeleted: true } : ans,
      );
      setAnswers(changedAnswers);
    },
    [answers],
  );

  const onAnswerFocusOut = useCallback(
    (event: FocusEvent, id?: number) => {
      //@ts-ignore
      const changedAnswerValue = event.target?.value + '';
      const isNumberAnswer =
        windowData?.content?.type === 'question' &&
        windowData.content.questionType === 'number' &&
        !id;

      if (isNumberAnswer) {
        const isDataExists = currentQuestion?.id && currentQuestion?.title;
        if (isDataExists) {
          dispatch(
            setCurrentQuestion({ ...currentQuestion, answer: +changedAnswerValue }),
          );
        }
      }

      if (!isNumberAnswer) {
        const currentAnswer = answers.filter((ans) => ans.id === id)[0];
        const isCorrectAnswer =
          changedAnswerValue !== currentAnswer.text && changedAnswerValue.trim() && id;

        if (isCorrectAnswer) {
          !!changedAnswerValue?.trim()
            ? setAnswers(
                answers.map((ans) =>
                  ans.id === id
                    ? {
                        ...ans,
                        isLocalInfo: true,
                        text: changedAnswerValue.replace(/\s+/gm, ' ').trim(),
                      }
                    : ans,
                ),
              )
            : onDeleteAnswerClick(id);
        }
      }
    },
    [dispatch, onDeleteAnswerClick, answers, currentQuestion, windowData?.content],
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
        answers.map((ans) => {
          const isCurrentDragAnswer = draggableAnswer && ans.id === draggableAnswer.id;
          const isDroppedAnswer = draggableAnswer && ans.id === answer.id;
          return isDroppedAnswer || isCurrentDragAnswer
            ? {
                ...ans,
                isLocalPosition: true,
                position: isDroppedAnswer ? draggableAnswer.position : answer.position,
              }
            : ans;
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
      currentQuestion.question_type !== 'number' &&
      currentQuestion?.answers;

    if (isCurrentQuestionEmptyOrNumber) {
      //@ts-ignore
      const changedAnswers = currentQuestion.answers.map((answer, index) => {
        return { ...answer, position: index };
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
              onAnswerCheckClick,
              onAnswerFocusOut,
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
          onSaveQuestionClick={onSaveQuestionClick}
          onCloseWindowClick={onCloseWindowClick}
        />
      </div>
    </aside>
  );
}

export default ModalWindow;

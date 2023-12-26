import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  ModalWindowContext,
  questionAnswerType,
} from '@/src/components/ModalWindow/ModalWindowContext';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { setErrorsState } from '@/src/reduxjs/reducers/baseReducer';
import { setCurrentQuestion } from '@/src/reduxjs/reducers/testReducer';
import { CheckboxModalAnswer } from './CheckboxModalAnswer';
import styles from './ModalQuestions.module.scss';

interface ModalQuestionsInterface {
  questionType: 'single' | 'multiple' | 'number';
}

function ModalQuestions({ questionType }: ModalQuestionsInterface): React.ReactNode {
  const { currentQuestionNumberAnswer, setAnswers, title, answers, refs } =
    useContext(ModalWindowContext);
  const currentQuestion = useAppSelector((state) => state.test.currentQuestion);
  const [draggableAnswer, setDraggableAnswer] = useState<questionAnswerType | null>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

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
    [answers, setAnswers],
  );

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
  }, [answers, dispatch, setAnswers]);

  const onDeleteAnswerClick = useCallback(
    (answerId: number) => {
      const changedAnswers = answers.map((ans) =>
        ans.id === answerId ? { ...ans, isDeleted: true } : ans,
      );
      setAnswers(changedAnswers);
    },
    [answers, setAnswers],
  );

  const onAnswerFocusOut = useCallback(
    (event: FocusEvent, id?: number) => {
      //@ts-ignore
      const changedAnswerValue = event.target?.value + '';
      const isNumberAnswer = questionType === 'number' && !id;

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
    [questionType, currentQuestion, dispatch, answers, setAnswers, onDeleteAnswerClick],
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
    [answers, draggableAnswer, setAnswers],
  );

  const dragEvents = {
    onAnswerDragStart,
    onAnswerDragEnd,
    onAnswerDragOver,
    onAnswerDrop,
  };

  const answerEvents = {
    onAddAnswerClick,
    onDeleteAnswerClick,
    onAnswerCheckClick,
    onAnswerFocusOut,
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
  }, [currentQuestion, setAnswers]);

  return (
    <>
      <div className={styles.questionAddTitle}>
        <input
          className={clsx(styles.questionInput, styles.input)}
          ref={refs.questionTitleRef}
          type="text"
          placeholder="Введите вопрос"
          id="questionTitle"
          defaultValue={title}
        />
        <label className={styles.inputTitle} htmlFor="questionTitle">
          Вопрос
        </label>
      </div>

      {(questionType === 'single' || questionType === 'multiple') && (
        <div className={styles.addAnswer}>
          <input
            className={clsx(styles.answerAddInput, styles.input)}
            type="text"
            placeholder="Введите вариант ответа"
            ref={answerInputRef}
            id="answerVariant"
          />
          <label className={styles.inputTitle} htmlFor="answerVariant">
            Вариант ответа
          </label>
          <button
            className={styles.answerAddButton}
            type="button"
            onClick={onAddAnswerClick}
          >
            +
          </button>
        </div>
      )}

      <div
        className={clsx(styles.answersContainer, {
          [styles.severalScroll]: questionType !== 'number',
        })}
      >
        {((questionType === 'single' || questionType === 'multiple') &&
          answers
            .sort((a, b) => (a.position > b.position ? 1 : -1))
            .map((answer) =>
              !answer.isDeleted ? (
                <CheckboxModalAnswer
                  key={answer.id}
                  answer={answer}
                  dragEvents={dragEvents}
                  answerEvents={answerEvents}
                />
              ) : undefined,
            )) ||
          (questionType === 'number' && (
            <div className={styles.numberAnswerContainer}>
              <input
                className={styles.answerNumber}
                ref={refs.numberAnswerRef}
                type="number"
                id="numberAnswer"
                name="numberAnswer"
                placeholder="Введите ответ на вопрос"
                //@ts-ignore
                onBlur={(event) => onAnswerFocusOut(event)}
                defaultValue={currentQuestionNumberAnswer}
              />
              <label className={styles.inputTitle} htmlFor="numberAnswer">
                Ответ
              </label>
            </div>
          ))}
      </div>
    </>
  );
}

export default ModalQuestions;

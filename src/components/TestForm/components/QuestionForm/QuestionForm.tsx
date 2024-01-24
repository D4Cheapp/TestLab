import React, { useCallback, useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useAppDispatch } from '@/src/hooks/reduxHooks';
import { setErrorsState } from '@/src/reduxjs/reducers/baseReducer';
import s from './QuestionForm.module.scss';
import { CheckboxModalAnswer } from './CheckboxModalAnswer';
import { TestFormContext, questionAnswerType } from '../../TestFormContext';

function QuestionForm(): React.ReactNode {
  const { currentQuestion, setCurrentQuestion, answers, setAnswers, form } =
    useContext(TestFormContext);
  const [draggableAnswer, setDraggableAnswer] = useState<questionAnswerType | null>(null);
  const dispatch = useAppDispatch();

  const { getValues, setValue, register } = form;
  const questionType = currentQuestion?.id
    ? currentQuestion?.question_type
    : getValues('questionType');

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
    const answerValue = getValues('answerInput');

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
      setValue('answerInput', '');
    } else {
      dispatch(
        setErrorsState('Error: Fill in the contents of the response before adding it'),
      );
    }
  }, [answers, dispatch, getValues, setAnswers, setValue]);

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
          setCurrentQuestion({ ...currentQuestion, answer: +changedAnswerValue });
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
    [
      questionType,
      currentQuestion,
      setCurrentQuestion,
      answers,
      setAnswers,
      onDeleteAnswerClick,
    ],
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
        return { ...answer, position: index } as questionAnswerType;
      });
      setAnswers(changedAnswers);
    } else {
      setAnswers([]);
    }
  }, [currentQuestion, setAnswers]);

  return (
    <>
      <div className={s.questionAddTitle}>
        <input
          className={clsx(s.questionInput, s.input)}
          type="text"
          placeholder="Введите вопрос"
          id="questionTitle"
          defaultValue={currentQuestion?.title}
          {...register('questionTitle')}
        />
        <label className={s.inputTitle} htmlFor="questionTitle">
          Вопрос
        </label>
      </div>

      {(questionType === 'single' || questionType === 'multiple') && (
        <div className={s.addAnswer}>
          <input
            className={clsx(s.answerAddInput, s.input)}
            type="text"
            placeholder="Введите вариант ответа"
            id="answerVariant"
            {...register('answerInput')}
          />
          <label className={s.inputTitle} htmlFor="answerVariant">
            Вариант ответа
          </label>
          <button
            className={s.answerAddButton}
            type="button"
            onClick={onAddAnswerClick}
          >
            +
          </button>
        </div>
      )}

      <div
        className={clsx(s.answersContainer, {
          [s.severalScroll]: questionType !== 'number',
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
                  questionType={questionType}
                  dragEvents={dragEvents}
                  answerEvents={answerEvents}
                />
              ) : undefined,
            )) ||
          (questionType === 'number' && (
            <div className={s.numberAnswerContainer}>
              <input
                className={s.answerNumber}
                type="number"
                id="numberAnswer"
                placeholder="Введите ответ на вопрос"
                //@ts-ignore
                onBlur={(event) => onAnswerFocusOut(event)}
                defaultValue={getValues('numberAnswer')}
                {...register('numberAnswer')}
              />
              <label className={s.inputTitle} htmlFor="numberAnswer">
                Ответ
              </label>
            </div>
          ))}
      </div>
    </>
  );
}

export default QuestionForm;

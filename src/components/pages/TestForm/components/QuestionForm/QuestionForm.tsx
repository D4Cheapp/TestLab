import React, { useCallback, useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { useActions } from '@/src/hooks/reduxHooks';
import { TestFormContext, QuestionAnswerType } from '../../TestFormContext';
import CheckboxModalAnswer from './CheckboxModalAnswer';
import s from './QuestionForm.module.scss';

const QuestionForm = (): React.ReactNode => {
  const { currentQuestion, setCurrentQuestion, answers, setAnswers, form } =
    useContext(TestFormContext);
  const [draggableAnswer, setDraggableAnswer] = useState<QuestionAnswerType | null>(null);
  const { setErrorsState } = useActions();
  const { getValues, setValue, register } = form;
  const questionType = currentQuestion?.id
    ? currentQuestion?.question_type
    : getValues('questionType');

  const handleAnswerCheckClick = useCallback(
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

  const handleAddAnswerClick = useCallback(() => {
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
      setErrorsState('Error: Fill in the contents of the response before adding it');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, getValues, setAnswers, setValue]);

  const handleDeleteAnswerClick = useCallback(
    (answerId: number) => {
      const changedAnswers = answers.map((ans) =>
        ans.id === answerId ? { ...ans, isDeleted: true } : ans,
      );
      setAnswers(changedAnswers);
    },
    [answers, setAnswers],
  );

  const handleAnswerFocusOut = useCallback(
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
            : handleDeleteAnswerClick(id);
        }
      }
    },
    [
      questionType,
      currentQuestion,
      setCurrentQuestion,
      answers,
      setAnswers,
      handleDeleteAnswerClick,
    ],
  );

  const handleAnswerDragStart = useCallback((answer: QuestionAnswerType) => {
    setDraggableAnswer(answer);
  }, []);

  const handleAnswerDragEnd = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove('dragStart');
  }, []);

  const handleAnswerDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.add('dragStart');
  }, []);

  const handleAnswerDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>, answer: QuestionAnswerType) => {
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
    onAnswerDragStart: handleAnswerDragStart,
    onAnswerDragEnd: handleAnswerDragEnd,
    onAnswerDragOver: handleAnswerDragOver,
    onAnswerDrop: handleAnswerDrop,
  };

  const answerEvents = {
    onAddAnswerClick: handleAddAnswerClick,
    onDeleteAnswerClick: handleDeleteAnswerClick,
    onAnswerCheckClick: handleAnswerCheckClick,
    onAnswerFocusOut: handleAnswerFocusOut,
  };

  useEffect(() => {
    const isCurrentQuestionEmptyOrNumber =
      currentQuestion !== undefined &&
      currentQuestion.question_type !== 'number' &&
      currentQuestion?.answers;
    if (isCurrentQuestionEmptyOrNumber) {
      //@ts-ignore
      const changedAnswers = currentQuestion.answers.map((answer, index) => {
        return { ...answer, position: index } as QuestionAnswerType;
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
          className={cn(s.questionInput, s.input)}
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
            className={cn(s.answerAddInput, s.input)}
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
            onClick={handleAddAnswerClick}
          >
            +
          </button>
        </div>
      )}
      <div
        className={cn(s.answersContainer, {
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
                onBlur={(event) => handleAnswerFocusOut(event)}
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
};

export default QuestionForm;

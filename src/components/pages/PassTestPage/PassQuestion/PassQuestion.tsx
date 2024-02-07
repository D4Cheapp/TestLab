import React, { ChangeEvent, MouseEvent } from 'react';
import cn from 'classnames';
import { CreateQuestionRequestType } from '@/src/types/requestTypes';
import s from './PassQuestion.module.scss';

interface Props {
  question: CreateQuestionRequestType;
  questionIndex: number;
  onAddAnswerClick: (
    event: MouseEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
    questionIndex: number,
    answerId?: number,
  ) => void;
  isCorrect?: boolean;
}

const PassQuestion = ({
  question,
  questionIndex,
  onAddAnswerClick,
  isCorrect,
}: Props): React.ReactNode => {
  const isNumberAnswer = question.answer !== null;
  const questionId = question.id + '';
  return (
    <div
      className={cn(
        s.question,
        { [s.correctQuestion]: isCorrect },
        { [s.wrongQuestion]: isCorrect !== undefined && !isCorrect },
      )}
      key={question.id}
    >
      <h2 className={s.title}>{question.title}</h2>
      {isNumberAnswer ? (
        <input
          className={s.numberAnswer}
          type="number"
          placeholder={'Введите числовой ответ'}
          name={questionId}
          id={questionId}
          onChange={(event) => onAddAnswerClick(event, questionIndex)}
        />
      ) : (
        question.answers?.map((ans) => (
          <label className={s.answer} key={ans.id}>
            {question.question_type === 'multiple' && (
              <>
                <input
                  className={s.checkbox}
                  type="checkbox"
                  id={ans.id + ''}
                  name={questionId}
                  onClick={(event) => onAddAnswerClick(event, questionIndex, ans.id)}
                />
                <div className={s.customCheckbox} />
              </>
            )}
            {question.question_type === 'single' && (
              <>
                <input
                  className={s.radioButton}
                  type="radio"
                  id={ans.id + ''}
                  name={questionId}
                  onClick={(event) => onAddAnswerClick(event, questionIndex, ans.id)}
                />
                <div className={s.customRadio} />
              </>
            )}
            <p className={s.answerTitle}>{ans.text}</p>
          </label>
        ))
      )}
    </div>
  );
};

export default PassQuestion;

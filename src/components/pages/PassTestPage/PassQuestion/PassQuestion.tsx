import React, { ChangeEvent, MouseEvent } from 'react';
import cn from 'classnames';
import { CreateQuestionRequestType } from '@/src/types/requestTypes';
import CustomInputButton from '@/src/components/common/CustomInputButton';
import CustomInput from '@/src/components/common/CustomInput';
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
        <CustomInput
          type="number"
          placeholder="Введите числовой ответ"
          name={questionId}
          onChange={(event) => onAddAnswerClick(event, questionIndex)}
        />
      ) : (
        question.answers?.map((ans) => (
          <label className={s.answer} key={ans.id}>
            {question.question_type === 'multiple' && (
              <CustomInputButton
                name={questionId}
                type="checkbox"
                id={ans.id + ''}
                width="1em"
                onChange={(event) => onAddAnswerClick(event, questionIndex, ans.id)}
              />
            )}
            {question.question_type === 'single' && (
              <CustomInputButton
                id={ans.id + ''}
                name={questionId}
                type="radio"
                width="1em"
                onChange={(event) => onAddAnswerClick(event, questionIndex, ans.id)}
              />
            )}
            <p className={s.answerTitle}>{ans.text}</p>
          </label>
        ))
      )}
    </div>
  );
};

export default PassQuestion;

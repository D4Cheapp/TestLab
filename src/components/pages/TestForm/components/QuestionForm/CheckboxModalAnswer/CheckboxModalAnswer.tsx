import React, { useState } from 'react';
import { QuestionAnswerType } from '../../../TestFormContext';
import s from './CheckboxModalAnswer.module.scss';

interface Props {
  answer: QuestionAnswerType;
  questionType: 'single' | 'multiple';
  dragEvents: {
    onAnswerDragStart: (answer: QuestionAnswerType) => void;
    onAnswerDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;
    onAnswerDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
    onAnswerDrop: (
      event: React.DragEvent<HTMLDivElement>,
      answer: QuestionAnswerType,
    ) => void;
  };
  answerEvents: {
    onAddAnswerClick: () => void;
    onDeleteAnswerClick: (index: number) => void;
    onAnswerCheckClick: (id: number) => void;
    onAnswerFocusOut: (event: FocusEvent, id?: number) => void;
  };
}

const CheckboxModalAnswer = ({
  answer,
  questionType,
  dragEvents,
  answerEvents,
}: Props): React.ReactNode => {
  const [isInputMode, setIsInputMode] = useState(false);

  const handleDoubleClick = () => {
    setIsInputMode(true);
  };

  return (
    <div
      className={s.answer}
      key={answer.id}
      draggable={true}
      onDragStart={() => dragEvents.onAnswerDragStart(answer)}
      onDragEnd={dragEvents.onAnswerDragEnd}
      onDragLeave={dragEvents.onAnswerDragEnd}
      onDragOver={dragEvents.onAnswerDragOver}
      onDrop={(event) => dragEvents.onAnswerDrop(event, answer)}
      onDoubleClick={handleDoubleClick}
    >
      <label className={s.answerLabel} htmlFor={`answer-input-${answer.id}`}>
        {questionType === 'multiple' && (
          <>
            <input
              className={s.answerCheckbox}
              type="checkbox"
              id={`answer-input-${answer.id}`}
              name="multiple-answer"
              onChange={() => answerEvents.onAnswerCheckClick(answer.id)}
              defaultChecked={answer.is_right}
            />
            <div className={s.customCheckbox} />
          </>
        )}
        {questionType === 'single' && (
          <>
            <input
              className={s.answerRadio}
              type="radio"
              id={`answer-input-${answer.id}`}
              name="single-answer"
              onChange={() => answerEvents.onAnswerCheckClick(answer.id)}
              defaultChecked={answer.is_right}
            />
            <div className={s.customRadio} />
          </>
        )}
        {isInputMode ? (
          <input
            className={s.answerTitleInput}
            type="text"
            id={`answer-title-${answer.id}`}
            name={`answer-${answer.id}`}
            defaultValue={answer.text}
            autoFocus={true}
            onBlur={(event) => {
              setIsInputMode(false);
              //@ts-ignore
              answerEvents.onAnswerFocusOut(event, answer.id);
            }}
          />
        ) : (
          <p className={s.answerTitle}>{answer.text}</p>
        )}
      </label>
      <button
        className={s.answerDeleteButton}
        type="button"
        onClick={() => answerEvents.onDeleteAnswerClick(answer.id)}
      >
        -
      </button>
    </div>
  );
};

export default CheckboxModalAnswer;

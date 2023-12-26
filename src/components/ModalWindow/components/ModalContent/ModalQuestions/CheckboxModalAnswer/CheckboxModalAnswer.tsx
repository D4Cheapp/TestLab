import React, { useState } from 'react';
import { questionAnswerType } from '@/src/components/ModalWindow/ModalWindowContext';
import styles from './CheckboxModalAnswer.module.scss';

interface CheckboxModalAnswerProps {
  answer: questionAnswerType;
  dragEvents: {
    onAnswerDragStart: (answer: questionAnswerType) => void;
    onAnswerDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;
    onAnswerDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
    onAnswerDrop: (
      event: React.DragEvent<HTMLDivElement>,
      answer: questionAnswerType,
    ) => void;
  };
  answerEvents: {
    onAddAnswerClick: () => void;
    onDeleteAnswerClick: (index: number) => void;
    onAnswerCheckClick: (id: number) => void;
    onAnswerFocusOut: (event: FocusEvent, id?: number) => void;
  };
}

function CheckboxModalAnswer({
  answer,
  dragEvents,
  answerEvents,
}: CheckboxModalAnswerProps): React.ReactNode {
  const [isInputMode, setIsInputMode] = useState(false);
  const onDoubleClick = () => {
    setIsInputMode(true);
  };

  return (
    <div
      className={styles.answer}
      key={answer.id}
      draggable={true}
      onDragStart={() => dragEvents.onAnswerDragStart(answer)}
      onDragEnd={dragEvents.onAnswerDragEnd}
      onDragLeave={dragEvents.onAnswerDragEnd}
      onDragOver={dragEvents.onAnswerDragOver}
      onDrop={(event) => dragEvents.onAnswerDrop(event, answer)}
      onDoubleClick={onDoubleClick}
    >
      <label className={styles.answerLabel} htmlFor={`answer-checkbox-${answer.id}`}>
        <input
          className={styles.answerCheckbox}
          type="checkbox"
          id={`answer-checkbox-${answer.id}`}
          name="singleAnswer"
          onChange={() => answerEvents.onAnswerCheckClick(answer.id)}
          defaultChecked={answer.is_right}
        />
        <div className={styles.customCheckbox} />

        {isInputMode ? (
          <input
            className={styles.answerTitleInput}
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
          <p className={styles.answerTitle}>{answer.text}</p>
        )}
      </label>
      <button
        className={styles.answerDeleteButton}
        type="button"
        onClick={() => answerEvents.onDeleteAnswerClick(answer.id)}
      >
        -
      </button>
    </div>
  );
}

export default CheckboxModalAnswer;

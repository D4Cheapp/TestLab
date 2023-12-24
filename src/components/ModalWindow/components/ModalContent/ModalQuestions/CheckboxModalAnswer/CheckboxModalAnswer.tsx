import React, { useContext } from 'react';
import {
  ModalWindowContext,
  questionAnswerType,
} from '@/src/components/ModalWindow/ModalWindowContext';
import styles from './CheckboxModalAnswer.module.scss';

interface CheckboxModalAnswerProps {
  answer: questionAnswerType;
}

function CheckboxModalAnswer({ answer }: CheckboxModalAnswerProps): React.ReactNode {
  const { onInputCheck, onAnswerFocusOut, clickEvents, dragEvents } =
    useContext(ModalWindowContext);
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
    >
      <label className={styles.answerLabel} htmlFor={`answer-checkbox-${answer.id}`}>
        <input
          className={styles.answerCheckbox}
          type="checkbox"
          id={`answer-checkbox-${answer.id}`}
          name="singleAnswer"
          onChange={() => onInputCheck(answer.id)}
          defaultChecked={answer.is_right}
        />
        <div className={styles.customCheckbox} />

        <input
          className={styles.answerTitle}
          type="text"
          id={`answer-title-${answer.id}`}
          name={`answer-${answer.id}`}
          defaultValue={answer.text}
          //@ts-ignore
          onBlur={(event) => onAnswerFocusOut(event, answer.id)}
        />
      </label>
      <button
        className={styles.answerDeleteButton}
        type="button"
        onClick={() => clickEvents.onDeleteAnswerClick(answer.id)}
      >
        -
      </button>
    </div>
  );
}

export default CheckboxModalAnswer;

import React, { useContext } from 'react';
import {
  ModalWindowContext,
  questionAnswerType,
} from '@/src/components/ModalWindow/ModalWindowContext';
import styles from './CheckboxModalAnswer.module.scss';

interface CheckboxModalAnswerProps {
  index: number;
  answer: questionAnswerType;
}

function CheckboxModalAnswer({
  index,
  answer,
}: CheckboxModalAnswerProps): React.ReactNode {
  const { onInputCheck, clickEvents, dragEvents } = useContext(ModalWindowContext);
  return (
    <div
      className={styles.answer}
      key={index}
      draggable={true}
      onDragStart={() => dragEvents.onAnswerDragStart(answer)}
      onDragEnd={dragEvents.onAnswerDragEnd}
      onDragLeave={dragEvents.onAnswerDragEnd}
      onDragOver={dragEvents.onAnswerDragOver}
      onDrop={(event) => dragEvents.onAnswerDrop(event, answer)}
    >
      <label className={styles.answerLabel} htmlFor={`answer-${index}`}>
        <input
          className={styles.answerCheckbox}
          type="checkbox"
          id={`answer-${index}`}
          name="singleAnswer"
          onChange={() => onInputCheck(index)}
          defaultChecked={answer.is_right}
        />
        {answer.text}
        <div className={styles.customCheckbox} />
      </label>
      <button
        className={styles.answerDeleteButton}
        type="button"
        onClick={() => clickEvents.onDeleteAnswerClick(index)}
      >
        -
      </button>
    </div>
  );
}

export default CheckboxModalAnswer;

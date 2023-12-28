import React, { ChangeEvent, MouseEvent } from 'react';
import { createQuestionRequestType } from '@/src/types/requestTypes';
import styles from './PassQuestion.module.scss';

interface PassQuestionInterface {
  question: createQuestionRequestType;
  onAddAnswerClick: (
    event: MouseEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
    questionId?: number,
    answerId?: number,
  ) => void;
}

function PassQuestion({
  question,
  onAddAnswerClick,
}: PassQuestionInterface): React.ReactNode {
  const isNumberAnswer = question.answer !== null;
  const questionId = question.id + '';
  return (
    <div className={styles.question} key={question.id}>
      <h2 className={styles.title}>{question.title}</h2>
      {isNumberAnswer ? (
        <input
          className={styles.numberAnswer}
          type="number"
          placeholder={'Введите числовой ответ'}
          name={questionId}
          id={questionId}
          onChange={(event) => onAddAnswerClick(event, +questionId)}
        />
      ) : (
        question.answers?.map((ans) => (
          <label className={styles.answer} key={ans.id}>
            {question.question_type === 'multiple' && (
              <>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  id={ans.id + ''}
                  name={questionId}
                  onClick={(event) => onAddAnswerClick(event, question.id, ans.id)}
                />
                <div className={styles.customCheckbox} />
              </>
            )}

            {question.question_type === 'single' && (
              <>
                <input
                  className={styles.radioButton}
                  type="radio"
                  id={ans.id + ''}
                  name={questionId}
                  onClick={(event) => onAddAnswerClick(event, question.id, ans.id)}
                />
                <div className={styles.customRadio} />
              </>
            )}
            <p className={styles.answerTitle}>{ans.text}</p>
          </label>
        ))
      )}
    </div>
  );
}

export default PassQuestion;

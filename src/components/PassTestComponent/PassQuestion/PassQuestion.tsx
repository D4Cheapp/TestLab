import React from 'react';
import { createQuestionRequestType } from '@/src/types/requestTypes';
import styles from './PassQuestion.module.scss';

interface PassQuestionInterface {
  question: createQuestionRequestType;
}

function PassQuestion({ question }: PassQuestionInterface): React.ReactNode {
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

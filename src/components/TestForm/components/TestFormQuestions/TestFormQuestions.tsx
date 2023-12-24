import React from 'react';
import clsx from 'clsx';
import { questionDataType } from '@/src/types/reducerInitialTypes';
import styles from './TestFormQuestions.module.scss';

interface TestFromQuestionsInterface {
  questions: questionDataType[] | undefined;
  withDeleteButton: boolean;
  onDeleteQuestionClick: (id: number) => void;
  onEditQuestionClick: (question: questionDataType) => void;
}

function TestFormQuestions({
  questions,
  withDeleteButton,
  onDeleteQuestionClick,
  onEditQuestionClick,
}: TestFromQuestionsInterface): React.ReactNode {
  return (
    <div className={styles.content}>
      <div className={styles.root}>
        {questions &&
          questions.map((question, id) => (
            <div className={styles.question} key={id}>
              <p className={styles.questionTitle}>{question.question.title}</p>

              <div className={styles.questionButtons}>
                {!withDeleteButton && (
                  <button
                    type="button"
                    className={clsx(styles.questionButton, styles.editButton)}
                    onClick={() => onEditQuestionClick(question)}
                  />
                )}

                <button
                  type="button"
                  className={clsx(styles.questionButton, styles.deleteButton)}
                  onClick={() => onDeleteQuestionClick(question.id)}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default TestFormQuestions;

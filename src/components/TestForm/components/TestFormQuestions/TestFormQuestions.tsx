import React from 'react';
import clsx from 'clsx';
import { createQuestionRequestType } from '@/src/types/requestTypes';
import styles from './TestFormQuestions.module.scss';

interface TestFromQuestionsInterface {
  questions?: createQuestionRequestType[];
  withDeleteButton: boolean;
  onDeleteQuestionClick: (id: number) => void;
  onEditQuestionClick: (question: createQuestionRequestType) => void;
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
              <p className={styles.questionTitle}>{question.title}</p>

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
                  onClick={() =>
                    question.id ? onDeleteQuestionClick(question.id) : undefined
                  }
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default TestFormQuestions;

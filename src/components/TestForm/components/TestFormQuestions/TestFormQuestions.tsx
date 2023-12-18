import React from 'react';
import clsx from 'clsx';
import { questionDataType } from '@/src/types/reducerInitialTypes';
import styles from './TestFormQuestions.module.scss';

interface TestFromQuestionsInterface {
  questions: questionDataType[] | undefined;
  onDeleteQuestionClick: (id: number) => void;
  onEditQuestionClick: (question: questionDataType) => void;
}

function TestFormQuestions({
  questions,
  onDeleteQuestionClick,
  onEditQuestionClick,
}: TestFromQuestionsInterface): React.ReactNode {
  return (
    <div className={styles.content}>
      <div className={styles.root}>
        {questions &&
          questions.map((question, id) => (
            <div className={styles.question} key={question.question.title} id={id + ''}>
              <p className={styles.questionTitle}>{question.question.title}</p>

              <div className={styles.questionButtons}>
                <button
                  type="button"
                  className={clsx(styles.questionButton, styles.editButton)}
                  onClick={() => onEditQuestionClick(question)}
                />
                <button
                  type="button"
                  className={clsx(styles.questionButton, styles.deleteButton)}
                  onClick={() => onDeleteQuestionClick(id)}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default TestFormQuestions;

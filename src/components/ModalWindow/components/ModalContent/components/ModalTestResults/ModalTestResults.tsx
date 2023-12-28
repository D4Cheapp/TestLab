import React from 'react';
import styles from './ModalTestResults.module.scss';

interface ModalTestResultsInterface {
  correct: number;
  wrong: number;
}

function ModalTestResults({
  correct,
  wrong,
}: ModalTestResultsInterface): React.ReactNode {
  return (
    <div className={styles.root}>
      <p className={styles.resultTitle}>Всего вопросов: {correct + wrong}</p>
      <p className={styles.resultTitle}>Правильных ответов: {correct} </p>
      <p className={styles.resultTitle}>Неправильных ответов: {wrong}</p>
    </div>
  );
}

export default ModalTestResults;

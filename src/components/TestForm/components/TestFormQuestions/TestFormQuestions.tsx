import React from 'react';
import { createQuestionRequestType } from '@/src/types/requestTypes';
import styles from './TestFormQuestions.module.scss';
import { FormQuestion } from './FormQuestion';

interface TestFromQuestionsInterface {
  questions?: createQuestionRequestType[];
}

function TestFormQuestions({ questions }: TestFromQuestionsInterface): React.ReactNode {
  return (
    <div className={styles.content}>
      <div className={styles.root}>
        {questions &&
          questions.map((question, id) => <FormQuestion question={question} key={id} />)}
      </div>
    </div>
  );
}

export default TestFormQuestions;

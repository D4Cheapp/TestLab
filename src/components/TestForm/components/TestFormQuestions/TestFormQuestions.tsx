import React from 'react';
import { createQuestionRequestType } from '@/src/types/requestTypes';
import s from './TestFormQuestions.module.scss';
import { FormQuestion } from './FormQuestion';

interface TestFromQuestionsInterface {
  questions?: createQuestionRequestType[];
}

function TestFormQuestions({ questions }: TestFromQuestionsInterface): React.ReactNode {
  return (
    <div className={s.content}>
      <div className={s.root}>
        {questions &&
          questions.map((question, id) => <FormQuestion question={question} key={id} />)}
      </div>
    </div>
  );
}

export default TestFormQuestions;

import React from 'react';
import { CreateQuestionRequestType } from '@/src/types/requestTypes';
import FormQuestion from './FormQuestion';
import s from './TestFormQuestions.module.scss';

interface Props {
  questions?: CreateQuestionRequestType[];
}

const TestFormQuestions = ({ questions }: Props): React.ReactNode => {
  return (
    <div className={s.content}>
      <div className={s.root}>
        {questions &&
          questions.map((question, id) => <FormQuestion question={question} key={id} />)}
      </div>
    </div>
  );
};

export default TestFormQuestions;

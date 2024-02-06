import React, { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useActions, useAppSelector } from '@/src/hooks/reduxHooks';
import { TestFormType } from '@/src/types/formTypes';
import { CreateQuestionRequestType } from '@/src/types/requestTypes';
import { CurrentTestType } from '@/src/reduxjs/test/types';
import { currentTestSelector } from '@/src/reduxjs/test/selectors';
import TestFormButtons from './components/TestFormButtons';
import TestFormQuestions from './components/TestFormQuestions';
import TestFormInfoEdit from './components/TestFormInfoEdit';
import { TestFormContext, QuestionAnswerType } from './TestFormContext';
import s from './TestForm.module.scss';

interface Props {
  initTest?: CurrentTestType;
  title: string;
  withDeleteButton?: boolean;
  action: SubmitHandler<TestFormType>;
}

function TestForm({
  initTest,
  title,
  withDeleteButton = false,
  action,
}: Props): React.ReactNode {
  const { register, handleSubmit, reset, getValues, setValue } = useForm<TestFormType>();
  const currentTest = useAppSelector(currentTestSelector);
  const questions = currentTest?.questions;
  const router = useRouter();
  const {
    setErrorsState,
    setCurrentTest,
    createQuestion,
    addLocalQuestion,
    editQuestion,
    editLocalQuestion,
    deleteQuestion,
    deleteLocalQuestion,
  } = useActions();

  const [answers, setAnswers] = useState<QuestionAnswerType[]>([]);
  const [isAddQuestionWindowActive, setIsAddQuestionWindowActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<CreateQuestionRequestType>();

  const isLocal = !initTest;
  const formContext = { register, getValues, setValue, reset };

  const questionValidation = useCallback(
    (
      questionType?: 'number' | 'multiple' | 'single',
      title?: string,
      checkedAnswerCount?: number,
      answerCount?: number,
    ): boolean => {
      const isTitleEmpty = !title?.trim();
      const isSingleQuestionError = questionType === 'single' && !checkedAnswerCount;
      const isMultiplyQuestionError =
        questionType === 'multiple' &&
        (!checkedAnswerCount || (checkedAnswerCount && checkedAnswerCount < 2));
      const isNumberQuestion = questionType === 'number';
      const isAnswerAmountError =
        (questionType === 'multiple' || questionType === 'single') &&
        (!answerCount || (answerCount && answerCount < 2));

      if (!questionType) {
        return false;
      }

      if (isTitleEmpty) {
        setErrorsState('Error: Question title should not be empty');
        return false;
      }

      if (isAnswerAmountError) {
        setErrorsState(
          'Error: Question should be at least 2 answer option in the question',
        );
        return false;
      }

      if (isSingleQuestionError) {
        setErrorsState('Error: Question should be 1 correct answer in the question');
        return false;
      }

      if (isMultiplyQuestionError) {
        setErrorsState(
          'Error: There cannot be less than 2 correct answers in the question',
        );
        return false;
      }

      if (isNumberQuestion) {
        const answer = getValues('numberAnswer');
        const isAnswerNotANumber = answer && isNaN(+answer);
        const isAnswerEmpty = answer === undefined;

        if (isAnswerNotANumber) {
          setErrorsState('Error: Answer should be a number');
          return false;
        }

        if (isAnswerEmpty) {
          setErrorsState('Error: Input field should not be empty');
          return false;
        }
      }

      return true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getValues],
  );

  const onQuestionModifyClick = useCallback(
    (isEdit: boolean): boolean => {
      const title = getValues('questionTitle');
      const question_type = currentQuestion?.id
        ? currentQuestion?.question_type
        : getValues('questionType');
      const checkedAnswerCount: number | undefined = answers
        ? answers.reduce((counter, answer) => (counter += +answer.is_right), 0)
        : undefined;
      const numberAnswer =
        getValues('numberAnswer') !== undefined ? +getValues('numberAnswer') : undefined;

      if (questionValidation(question_type, title, checkedAnswerCount, answers.length)) {
        const isServerQuestion = !isLocal && title && question_type;

        if (isServerQuestion) {
          const test_id = currentTest?.id;
          const isServerEdit = isEdit && currentQuestion?.id;
          const questionData = {
            title,
            question_type,
            isQuestionLocal: currentQuestion?.isQuestionLocal,
            answer: numberAnswer,
            answers: answers ?? undefined,
            test_id,
          };

          isServerEdit
            ? editQuestion({
                ...questionData,
                //@ts-ignore
                id: currentQuestion.id,
              })
            : createQuestion(questionData);
        } else {
          const questionData = {
            id: isEdit && currentQuestion ? currentQuestion.id : Date.now(),
            question_type,
            title,
            isQuestionLocal: true,
            answer: numberAnswer,
            answers: answers ?? undefined,
          };

          isEdit
            ? //@ts-ignore
              editLocalQuestion(questionData)
            : //@ts-ignore
              addLocalQuestion(questionData);
        }

        setAnswers([]);

        if (!isEdit) {
          setIsAddQuestionWindowActive(false);
        }
        return true;
      }
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [answers, currentTest?.id, isLocal, getValues, questionValidation],
  );

  const onGoBackButtonClick = useCallback(() => {
    setCurrentTest(undefined);
    router.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const onAddQuestionClick = useCallback(() => {
    const questionType = getValues('questionType');
    const isQuestion =
      questionType === 'single' ||
      questionType === 'multiple' ||
      questionType === 'number';

    if (isQuestion) {
      setIsAddQuestionWindowActive(true);
    } else {
      setErrorsState('Error: Before adding a question, select its type');
    }
  }, [getValues, setErrorsState]);

  const onDeleteQuestionConfirmClick = useCallback(
    (id: number) => {
      setAnswers([]);
      setCurrentQuestion(undefined);
      isLocal
        ? deleteLocalQuestion({ id })
        : deleteQuestion({ id, test_id: currentTest?.id });
      reset();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTest?.id, isLocal, reset],
  );

  useEffect(() => {
    if (initTest?.title) {
      setValue('title', initTest.title);
    }
  }, [initTest?.title, setValue]);

  useEffect(() => {
    if (currentQuestion) {
      const isNumberAnswer = currentQuestion.answer;
      setValue('questionTitle', currentQuestion.title);

      if (isNumberAnswer) {
        //@ts-ignore
        setValue('numberAnswer', currentQuestion.answer);
      }
    }
  }, [currentQuestion, setValue]);

  return (
    <form
      className={s.root}
      name="testForm"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(action)}
    >
      <h1 className={s.formTitle}>{title}</h1>

      <TestFormContext.Provider
        value={{
          answers,
          withDeleteButton,
          onQuestionModifyClick,
          onDeleteQuestionConfirmClick,
          setAnswers,
          setCurrentQuestion,
          currentQuestion,
          form: formContext,
        }}
      >
        <TestFormInfoEdit
          title={initTest?.title}
          onAddQuestionClick={onAddQuestionClick}
          modalWindowData={{
            isAddQuestionWindowActive,
            setIsAddQuestionWindowActive,
          }}
        />

        <TestFormQuestions questions={questions} />
      </TestFormContext.Provider>

      <TestFormButtons
        onGoBackButtonClick={onGoBackButtonClick}
        withDeleteButton={withDeleteButton}
      />
    </form>
  );
}

export default TestForm;

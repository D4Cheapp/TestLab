import React, { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { TestFormType } from '@/src/types/formTypes';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { setErrorsState } from '@/src/reduxjs/reducers/baseReducer';
import {
  addLocalQuestion,
  createQuestion,
  deleteLocalQuestion,
  deleteQuestion,
  editLocalQuestion,
  editQuestion,
  setCurrentTest,
} from '@/src/reduxjs/reducers/testReducer';
import { CurrentTestType } from '@/src/types/reducerInitialTypes';
import { CreateQuestionRequestType } from '@/src/types/requestTypes';
import { TestFormContext, QuestionAnswerType } from './TestFormContext';
import s from './TestForm.module.scss';
import TestFormButtons from './components/TestFormButtons';
import TestFormQuestions from './components/TestFormQuestions';
import TestFormInfoEdit from './components/TestFormInfoEdit';

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
  const currentTest = useAppSelector((state) => state.test.currentTest);
  const questions = currentTest?.questions;
  const dispatch = useAppDispatch();
  const router = useRouter();

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
        dispatch(setErrorsState('Error: Question title should not be empty'));
        return false;
      }

      if (isAnswerAmountError) {
        dispatch(
          setErrorsState(
            'Error: Question should be at least 2 answer option in the question',
          ),
        );
        return false;
      }

      if (isSingleQuestionError) {
        dispatch(
          setErrorsState('Error: Question should be 1 correct answer in the question'),
        );
        return false;
      }

      if (isMultiplyQuestionError) {
        dispatch(
          setErrorsState(
            'Error: There cannot be less than 2 correct answers in the question',
          ),
        );
        return false;
      }

      if (isNumberQuestion) {
        const answer = getValues('numberAnswer');
        const isAnswerNotANumber = answer && isNaN(+answer);
        const isAnswerEmpty = answer === undefined;

        if (isAnswerNotANumber) {
          dispatch(setErrorsState('Error: Answer should be a number'));
          return false;
        }

        if (isAnswerEmpty) {
          dispatch(setErrorsState('Error: Input field should not be empty'));
          return false;
        }
      }

      return true;
    },
    [dispatch, getValues],
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

          dispatch(
            isServerEdit
              ? editQuestion({
                  ...questionData,
                  //@ts-ignore
                  id: currentQuestion.id,
                })
              : createQuestion(questionData),
          );
        } else {
          const questionData = {
            id: isEdit && currentQuestion ? currentQuestion.id : Date.now(),
            question_type,
            title,
            isQuestionLocal: true,
            answer: numberAnswer,
            answers: answers ?? undefined,
          };

          dispatch(
            isEdit
              ? //@ts-ignore
                editLocalQuestion(questionData)
              : //@ts-ignore
                addLocalQuestion(questionData),
          );
        }

        setAnswers([]);

        if (!isEdit) {
          setIsAddQuestionWindowActive(false);
        }
        return true;
      }
      return false;
    },
    [
      answers,
      currentQuestion,
      currentTest?.id,
      dispatch,
      getValues,
      isLocal,
      questionValidation,
    ],
  );

  const onGoBackButtonClick = useCallback(() => {
    dispatch(setCurrentTest(undefined));
    router.push('/');
  }, [dispatch, router]);

  const onAddQuestionClick = useCallback(() => {
    const questionType = getValues('questionType');
    const isQuestion =
      questionType === 'single' ||
      questionType === 'multiple' ||
      questionType === 'number';

    if (isQuestion) {
      setIsAddQuestionWindowActive(true);
    } else {
      dispatch(setErrorsState('Error: Before adding a question, select its type'));
    }
  }, [dispatch, getValues]);

  const onDeleteQuestionConfirmClick = useCallback(
    (id: number) => {
      setAnswers([]);
      setCurrentQuestion(undefined);
      dispatch(
        isLocal
          ? deleteLocalQuestion({ id })
          : deleteQuestion({ id, test_id: currentTest?.id }),
      );
      reset();
    },
    [currentTest?.id, dispatch, isLocal, reset],
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

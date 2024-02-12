import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, useFormikContext } from 'formik';
import { useActions, useAppSelector } from '@/src/hooks/reduxHooks';
import { TestFormType } from '@/src/types/formTypes';
import { CreateQuestionRequestType } from '@/src/types/requestTypes';
import { CurrentTestType } from '@/src/reduxjs/test/types';
import { currentTestSelector } from '@/src/reduxjs/test/selectors';
import TestFormButtons from './components/TestFormButtons';
import FormQuestion from './components/FormQuestion';
import TestFormInfoEdit from './components/TestFormInfoEdit';
import { TestFormContext, QuestionAnswerType } from './TestFormContext';
import s from './TestForm.module.scss';

interface Props {
  title: string;
  initTest?: CurrentTestType;
  withDeleteButton?: boolean;
}

function TestForm({ title, initTest, withDeleteButton = false }: Props): React.ReactNode {
  const { values, resetForm, setFieldValue } = useFormikContext<TestFormType>();
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

  const questionValidation = (
    questionType?: TestFormType['questionType'],
    title?: string,
    checkedAnswerCount?: number,
    answerCount?: number,
    numberAnswer?: number,
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
      setErrorsState('Error: Question should be at least 2 answer option in the question');
      return false;
    }
    if (isSingleQuestionError) {
      setErrorsState('Error: Question should be 1 correct answer in the question');
      return false;
    }
    if (isMultiplyQuestionError) {
      setErrorsState('Error: There cannot be less than 2 correct answers in the question');
      return false;
    }
    if (isNumberQuestion) {
      const isAnswerNotANumber = numberAnswer && isNaN(+numberAnswer);
      const isAnswerEmpty = numberAnswer === undefined;
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
  };

  const handleQuestionModifyClick = useCallback(
    (isEdit: boolean): boolean => {
      const title = values.questionTitle;
      const question_type = (currentQuestion?.id
        ? currentQuestion?.question_type
        : values.questionType) as TestFormType['questionType'];
      const checkedAnswerCount: number | undefined = answers
        ? answers.reduce((counter, answer) => (counter += +answer.is_right), 0)
        : undefined;
      const numberAnswer = values.numberAnswer !== undefined ? +values.numberAnswer : undefined;
      if (
        questionValidation(question_type, title, checkedAnswerCount, answers.length, numberAnswer)
      ) {
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
    [
      answers,
      currentTest?.id,
      isLocal,
      values.numberAnswer,
      values.questionTitle,
      values.questionType,
    ],
  );

  const handleGoBackButtonClick = useCallback(() => {
    setCurrentTest(undefined);
    router.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleAddQuestionClick = useCallback(() => {
    const questionType = values.questionType;
    const isQuestion =
      questionType === 'single' || questionType === 'multiple' || questionType === 'number';

    if (isQuestion) {
      setIsAddQuestionWindowActive(true);
    } else {
      setErrorsState('Error: Before adding a question, select its type');
    }
  }, [setErrorsState, values.questionType]);

  const handleDeleteQuestionConfirmClick = useCallback(
    (id: number) => {
      setAnswers([]);
      setCurrentQuestion(undefined);
      isLocal ? deleteLocalQuestion({ id }) : deleteQuestion({ id, test_id: currentTest?.id });
      resetForm();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTest?.id, isLocal, resetForm],
  );

  const handleSetQuestionValues = async () => {
    if (currentQuestion) {
      const isNumberAnswer = currentQuestion.answer;
      await setFieldValue('questionTitle', currentQuestion.title);
      if (isNumberAnswer) {
        await setFieldValue('numberAnswer', currentQuestion.answer);
      }
    }
  };

  const handleSetTitleValue = async () => {
    if (initTest?.title) {
      await setFieldValue('testTitle', initTest.title);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void handleSetTitleValue(), [initTest?.title, setFieldValue]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void handleSetQuestionValues(), [currentQuestion, setFieldValue]);

  return (
    <Form className={s.root}>
      <h1 className={s.formTitle}>{title}</h1>
      <TestFormContext.Provider
        value={{
          answers,
          withDeleteButton,
          onQuestionModifyClick: handleQuestionModifyClick,
          onDeleteQuestionConfirmClick: handleDeleteQuestionConfirmClick,
          setAnswers,
          setCurrentQuestion,
          currentQuestion,
        }}
      >
        <TestFormInfoEdit
          onAddQuestionClick={handleAddQuestionClick}
          modalWindowData={{
            isAddQuestionWindowActive,
            setIsAddQuestionWindowActive,
          }}
        />
        <div className={s.content}>
          <div className={s.formQuestions}>
            {questions &&
              questions.map((question, id) => <FormQuestion question={question} key={id} />)}
          </div>
        </div>
      </TestFormContext.Provider>
      <TestFormButtons
        onGoBackButtonClick={handleGoBackButtonClick}
        withDeleteButton={withDeleteButton}
      />
    </Form>
  );
}

export default TestForm;

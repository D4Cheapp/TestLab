import React, { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { testFormType } from '@/src/types/formTypes';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { setErrorsState, setModalWindowState } from '@/src/reduxjs/reducers/baseReducer';
import { setCurrentQuestion, setTest } from '@/src/reduxjs/reducers/testReducer';
import { currentTestType } from '@/src/types/reducerInitialTypes';
import { createQuestionRequestType } from '@/src/types/requestTypes';
import { TestFormButtons, TestFormInfoEdit, TestFormQuestions } from './components';
import styles from './TestForm.module.scss';

interface TestFormInterface {
  initTest?: currentTestType;
  title: string;
  withDeleteButton?: boolean;
  action: SubmitHandler<testFormType>;
}

function TestForm({
  initTest,
  title,
  withDeleteButton = false,
  action,
}: TestFormInterface): React.ReactNode {
  const { register, handleSubmit, getValues } = useForm<testFormType>();
  const questions = useAppSelector((state) => state.test.currentTest?.questions);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLocal = !initTest;

  const onGoBackButtonClick = useCallback(() => {
    dispatch(setTest(undefined));
    router.push('/');
  }, [dispatch, router]);

  const onAddQuestionClick = useCallback(() => {
    const questionType = getValues('questionSelect');
    const isQuestion =
      questionType === 'single' ||
      questionType === 'multiple' ||
      questionType === 'number';

    if (isQuestion) {
      dispatch(
        setModalWindowState({
          title: 'Добавление вопроса',
          content: { type: 'question', questionType, isLocal },
          buttons: {
            save: {
              saveTarget: 'question',
              id: isLocal ? questions?.length : initTest.id,
            },
          },
        }),
      );
    } else {
      dispatch(setErrorsState('Error: Before adding a question, select its type'));
    }
  }, [dispatch, getValues, initTest?.id, isLocal, questions?.length]);

  const onDeleteQuestionClick = useCallback(
    (id: number) => {
      dispatch(
        setModalWindowState({
          title: 'Подтвердите удаление вопроса',
          buttons: { withConfirmButton: true, delete: { deleteTarget: 'question', id } },
        }),
      );
    },
    [dispatch],
  );

  const onEditQuestionClick = useCallback(
    (question: createQuestionRequestType) => {
      dispatch(setCurrentQuestion(question));
      dispatch(
        setModalWindowState({
          title: 'Добавление вопроса',
          content: {
            type: 'question',
            questionType: question.question_type,
            isLocal: !initTest,
          },
          buttons: { save: { saveTarget: 'question', id: question.id } },
          isEdit: true,
        }),
      );
    },
    [dispatch, initTest],
  );

  return (
    <form
      className={styles.root}
      name="testForm"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(action)}
    >
      <h1 className={styles.formTitle}>{title}</h1>

      <TestFormInfoEdit
        title={initTest?.title}
        withDeleteButton={withDeleteButton}
        onAddQuestionClick={onAddQuestionClick}
        register={register}
      />

      <TestFormQuestions
        questions={questions}
        withDeleteButton={withDeleteButton}
        onDeleteQuestionClick={onDeleteQuestionClick}
        onEditQuestionClick={onEditQuestionClick}
      />

      <TestFormButtons
        onGoBackButtonClick={onGoBackButtonClick}
        withDeleteButton={withDeleteButton}
      />
    </form>
  );
}

export default TestForm;

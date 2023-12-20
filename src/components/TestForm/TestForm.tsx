import React, { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { testFormType } from '@/src/types/formTypes';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { setErrorsState, setModalWindowState } from '@/src/reduxjs/reducers/baseReducer';
import { setCurrentQuestion } from '@/src/reduxjs/reducers/testReducer';
import { questionDataType } from '@/src/types/reducerInitialTypes';
import { testReceiveType } from '@/src/types/receiveTypes';
import { TestFormButtons, TestFormInfoEdit, TestFormQuestions } from './components';
import styles from './TestForm.module.scss';

interface TestFormInterface {
  initTest?: testReceiveType;
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
  const questions = useAppSelector((state) => state.test.questions);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onGoBackButtonClick = useCallback(() => router.push('/'), [router]);

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
          content: { type: 'question', questionType },
        }),
      );
    } else {
      dispatch(setErrorsState('Error: Before adding a question, select its type'));
    }
  }, [dispatch, getValues]);

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
    (question: questionDataType) => {
      dispatch(setCurrentQuestion(question));
      dispatch(
        setModalWindowState({
          title: 'Добавление вопроса',
          content: { type: 'question', questionType: question.question.question_type },
          isEdit: true,
        }),
      );
    },
    [dispatch],
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
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

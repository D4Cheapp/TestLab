import React, { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { testFormType } from '@/src/types/formTypes';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { setCurrentQuestionState, setModalWindowState } from '@/src/reduxjs/reducers/modalWindowReducer';
import { setErrorsState } from '@/src/reduxjs/reducers/baseReducer';
import { questionDataType } from '@/src/types/reducerInitialTypes';
import { createQuestionReceiveType } from '@/src/types/receiveTypes';
import { TestFormButtons, TestFormInfoEdit, TestFormQuestions } from './components';
import styles from './TestForm.module.scss';

interface TestFormInterface {
  title: string;
  initialQuestions?: createQuestionReceiveType[];
  withDeleteButton?: boolean;
  action: SubmitHandler<testFormType>;
}

function TestForm({
  title,
  withDeleteButton = false,
  action,
}: TestFormInterface): React.ReactNode {
  const { register, handleSubmit, getValues } = useForm<testFormType>();
  const questions = useAppSelector((state) => state.modalWindow.questions);
  const dispatch = useAppDispatch();

  const onAddQuestionClick = useCallback(() => {
    const questionType = getValues('questionSelect');

    if (
      questionType === 'single' ||
      questionType === 'multiple' ||
      questionType === 'number'
    ) {
      dispatch(
        setModalWindowState({
          title: 'Добавление вопроса',
          content: { type: 'question', questionType },
        }),
      );
    } else {
      dispatch(setErrorsState('Ошибка: Прежде чем добавить вопрос выберите его тип'));
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
      dispatch(setCurrentQuestionState(question));
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
        withDeleteButton={withDeleteButton}
        onAddQuestionClick={onAddQuestionClick}
        register={register}
      />

      <TestFormQuestions
        questions={questions}
        onDeleteQuestionClick={onDeleteQuestionClick}
        onEditQuestionClick={onEditQuestionClick}
      />

      <TestFormButtons withDeleteButton={withDeleteButton} />
    </form>
  );
}

export default TestForm;

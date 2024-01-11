import React, { useContext, useState } from 'react';
import clsx from 'clsx';
import { createQuestionRequestType } from '@/src/types/requestTypes';
import { ModalWindow } from '@/src/components/ModalWindow';
import styles from './FormQuestion.module.scss';
import { QuestionForm } from '../..';
import { TestFormContext } from '../../../TestFormContext';

interface FormQuestionInterface {
  question: createQuestionRequestType;
}

function FormQuestion({ question }: FormQuestionInterface): React.ReactNode {
  const {
    setCurrentQuestion,
    withDeleteButton,
    onQuestionModifyClick,
    onDeleteQuestionConfirmClick,
    form,
  } = useContext(TestFormContext);
  const [isDeleteQuestionWindowActive, setIsDeleteQuestionWindowActive] = useState(false);
  const [isEditQuestionWindowActive, setIsEditQuestionWindowActive] = useState(false);

  const onDeleteQuestionClick = () => {
    setIsDeleteQuestionWindowActive(true);
  };

  const onEditQuestionClick = (question: createQuestionRequestType) => {
    setCurrentQuestion(question);
    setIsEditQuestionWindowActive(true);
  };

  const saveConfirmAction = () => {
    if (onQuestionModifyClick(true)) {
      setIsEditQuestionWindowActive(false);
    }
  };

  const setActiveWindowAction = () => {
    setIsEditQuestionWindowActive(false);
    setCurrentQuestion(undefined);
    form.reset();
  };

  const deleteConfirmAction = () => {
    question.id ? onDeleteQuestionConfirmClick(question.id) : undefined;
    setIsDeleteQuestionWindowActive(false);
  };

  const setDeleteWindowAction = () => {
    setIsDeleteQuestionWindowActive(false);
    setCurrentQuestion(undefined);
    form.reset();
  };

  return (
    <div className={styles.question}>
      <p className={styles.questionTitle}>{question.title}</p>

      <div className={styles.questionButtons}>
        {!withDeleteButton && (
          <>
            {isEditQuestionWindowActive && (
              <ModalWindow
                title="Изменение вопроса"
                buttonInfo={{
                  confirmTitle: 'Сохранить',
                  withConfirmButton: true,
                }}
                confirmAction={saveConfirmAction}
                setIsActive={setActiveWindowAction}
              >
                <QuestionForm />
              </ModalWindow>
            )}
            <button
              type="button"
              className={clsx(styles.questionButton, styles.editButton)}
              onClick={() => onEditQuestionClick(question)}
            />
          </>
        )}

        {isDeleteQuestionWindowActive && (
          <ModalWindow
            title="Подтвердите удаление вопроса"
            buttonInfo={{ withConfirmButton: true }}
            confirmAction={deleteConfirmAction}
            setIsActive={setDeleteWindowAction}
          ></ModalWindow>
        )}
        <button
          type="button"
          className={clsx(styles.questionButton, styles.deleteButton)}
          onClick={() => (question.id ? onDeleteQuestionClick() : undefined)}
        />
      </div>
    </div>
  );
}

export default FormQuestion;
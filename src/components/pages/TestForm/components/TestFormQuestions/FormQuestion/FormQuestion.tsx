import React, { useContext, useState } from 'react';
import clsx from 'clsx';
import { CreateQuestionRequestType } from '@/src/types/requestTypes';
import ModalWindow from '@/src/components/common/ModalWindow';
import s from './FormQuestion.module.scss';
import { TestFormContext } from '../../../TestFormContext';
import QuestionForm from '../../QuestionForm';

interface Props {
  question: CreateQuestionRequestType;
}

function FormQuestion({ question }: Props): React.ReactNode {
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

  const onEditQuestionClick = (question: CreateQuestionRequestType) => {
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
    <div className={s.question}>
      <p className={s.questionTitle}>{question.title}</p>

      <div className={s.questionButtons}>
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
              className={clsx(s.questionButton, s.editButton)}
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
          className={clsx(s.questionButton, s.deleteButton)}
          onClick={() => (question.id ? onDeleteQuestionClick() : undefined)}
        />
      </div>
    </div>
  );
}

export default FormQuestion;

import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { CreateQuestionRequestType } from '@/src/types/requestTypes';
import ModalWindow from '@/src/components/common/ModalWindow';
import { TestFormContext } from '../../../TestFormContext';
import QuestionForm from '../../QuestionForm';
import s from './FormQuestion.module.scss';

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

  const handleDeleteQuestionClick = () => {
    setIsDeleteQuestionWindowActive(true);
  };

  const handleEditQuestionClick = (question: CreateQuestionRequestType) => {
    setCurrentQuestion(question);
    setIsEditQuestionWindowActive(true);
  };

  const handleSaveConfirmClick = () => {
    if (onQuestionModifyClick(true)) {
      setIsEditQuestionWindowActive(false);
    }
  };

  const setActiveWindowAction = () => {
    setIsEditQuestionWindowActive(false);
    setCurrentQuestion(undefined);
    form.reset();
  };

  const handleDeleteConfirmClick = () => {
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
                onConfirmClick={handleSaveConfirmClick}
                setIsActive={setActiveWindowAction}
              >
                <QuestionForm />
              </ModalWindow>
            )}
            <button
              type="button"
              className={classNames(s.questionButton, s.editButton)}
              onClick={() => handleEditQuestionClick(question)}
            />
          </>
        )}
        {isDeleteQuestionWindowActive && (
          <ModalWindow
            title="Подтвердите удаление вопроса"
            buttonInfo={{ withConfirmButton: true }}
            onConfirmClick={handleDeleteConfirmClick}
            setIsActive={setDeleteWindowAction}
          />
        )}
        <button
          type="button"
          className={classNames(s.questionButton, s.deleteButton)}
          onClick={() => (question.id ? handleDeleteQuestionClick() : undefined)}
        />
      </div>
    </div>
  );
}

export default FormQuestion;

import React, { useCallback, useContext, useState } from 'react';
import cn from 'classnames';
import { useFormikContext } from 'formik';
import { CreateQuestionRequestType } from '@/src/types/requestTypes';
import ModalWindow from '@/src/components/common/ModalWindow';
import ModalQuestionForm from '../ModalQuestionForm';
import { TestFormContext } from '../../TestFormContext';
import s from './FormQuestion.module.scss';

interface Props {
  question: CreateQuestionRequestType;
}

const FormQuestion = ({ question }: Props): React.ReactNode => {
  const {
    setCurrentQuestion,
    withDeleteButton,
    onQuestionModifyClick,
    onDeleteQuestionConfirmClick,
  } = useContext(TestFormContext);
  const { resetForm } = useFormikContext();
  const [isDeleteQuestionWindowActive, setIsDeleteQuestionWindowActive] = useState(false);
  const [isEditQuestionWindowActive, setIsEditQuestionWindowActive] = useState(false);

  const handleDeleteQuestionClick = () => {
    setIsDeleteQuestionWindowActive(true);
  };

  const handleEditQuestionClick = (question: CreateQuestionRequestType) => {
    setCurrentQuestion(question);
    setIsEditQuestionWindowActive(true);
  };

  const handleSaveConfirmClick = useCallback(() => {
    if (onQuestionModifyClick(true)) {
      setIsEditQuestionWindowActive(false);
    }
  }, [onQuestionModifyClick]);

  const setActiveWindowAction = useCallback(() => {
    setIsEditQuestionWindowActive(false);
    setCurrentQuestion(undefined);
    resetForm();
  }, [resetForm, setCurrentQuestion]);

  const handleDeleteConfirmClick = useCallback(() => {
    question.id ? onDeleteQuestionConfirmClick(question.id) : undefined;
    setIsDeleteQuestionWindowActive(false);
  }, [onDeleteQuestionConfirmClick, question.id]);

  const setDeleteWindowAction = useCallback(() => {
    setIsDeleteQuestionWindowActive(false);
    setCurrentQuestion(undefined);
    resetForm();
  }, [resetForm, setCurrentQuestion]);

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
                <ModalQuestionForm />
              </ModalWindow>
            )}
            <button
              type="button"
              className={cn(s.questionButton, s.editButton)}
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
          className={cn(s.questionButton, s.deleteButton)}
          onClick={() => (question.id ? handleDeleteQuestionClick() : undefined)}
        />
      </div>
    </div>
  );
};

export default FormQuestion;

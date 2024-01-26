import React, { Dispatch, SetStateAction, useContext } from 'react';
import clsx from 'clsx';
import ModalWindow from '@/src/components/common/ModalWindow';
import s from './TestFormInfoEdit.module.scss';
import { TestFormContext } from '../../TestFormContext';
import QuestionForm from '../QuestionForm';

interface Props {
  title?: string;
  onAddQuestionClick: () => void;
  modalWindowData: {
    isAddQuestionWindowActive: boolean;
    setIsAddQuestionWindowActive: Dispatch<SetStateAction<boolean>>;
  };
}

function TestFormInfoEdit({
  title,
  onAddQuestionClick,
  modalWindowData,
}: Props): React.ReactNode {
  const { withDeleteButton, onQuestionModifyClick, setCurrentQuestion, form } =
    useContext(TestFormContext);
  const setAddWindowAction = () => {
    modalWindowData.setIsAddQuestionWindowActive(false);
    setCurrentQuestion(undefined);
    form.reset();
  };

  return (
    <div
      className={clsx(s.editContainer, {
        [s.singleContainer]: withDeleteButton,
      })}
    >
      <div
        className={clsx(s.contentContainer, {
          [s.mainInput]: withDeleteButton,
        })}
      >
        <h2 className={s.testNameTitle}>Название теста</h2>
        <input
          className={s.testNameInput}
          type="text"
          readOnly={withDeleteButton}
          placeholder="Введите название теста"
          defaultValue={title ?? ''}
          id="title"
          {...form.register('title')}
        />
      </div>

      {!withDeleteButton && (
        <div className={s.contentContainer}>
          <h2 className={s.testNameTitle}>Добавление вопроса</h2>

          <div className={s.chooseQuestionContainer}>
            <select
              className={s.questionType}
              defaultValue={''}
              id="questionSelect"
              {...form.register('questionType')}
            >
              <option className={s.questionTypeOption} value="">
                Выберите тип вопроса
              </option>
              <option className={s.questionTypeOption} value="single">
                Один из списка
              </option>
              <option className={s.questionTypeOption} value="multiple">
                Несколько из списка
              </option>
              <option className={s.questionTypeOption} value="number">
                Численный ответ
              </option>
            </select>

            {modalWindowData.isAddQuestionWindowActive && (
              <ModalWindow
                title="Добавление вопроса"
                setIsActive={setAddWindowAction}
                confirmAction={() => onQuestionModifyClick(false)}
                buttonInfo={{ confirmTitle: 'Сохранить', withConfirmButton: true }}
              >
                <QuestionForm />
              </ModalWindow>
            )}

            <button type="button" className={s.addButton} onClick={onAddQuestionClick}>
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestFormInfoEdit;

import React, { Dispatch, SetStateAction, useContext } from 'react';
import clsx from 'clsx';
import { ModalWindow } from '@/src/components/ModalWindow';
import styles from './TestFormInfoEdit.module.scss';
import { QuestionForm } from '..';
import { TestFormContext } from '../../TestFormContext';

interface TestFormInfoEditInterface {
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
}: TestFormInfoEditInterface): React.ReactNode {
  const { withDeleteButton, onQuestionModifyClick, setCurrentQuestion, form } =
    useContext(TestFormContext);
  const setAddWindowAction = () => {
    modalWindowData.setIsAddQuestionWindowActive(false);
    setCurrentQuestion(undefined);
    form.reset();
  };

  return (
    <div
      className={clsx(styles.editContainer, {
        [styles.singleContainer]: withDeleteButton,
      })}
    >
      <div
        className={clsx(styles.contentContainer, {
          [styles.mainInput]: withDeleteButton,
        })}
      >
        <h2 className={styles.testNameTitle}>Название теста</h2>
        <input
          className={styles.testNameInput}
          type="text"
          readOnly={withDeleteButton}
          placeholder="Введите название теста"
          defaultValue={title ?? ''}
          id="title"
          {...form.register('title')}
        />
      </div>

      {!withDeleteButton && (
        <div className={styles.contentContainer}>
          <h2 className={styles.testNameTitle}>Добавление вопроса</h2>

          <div className={styles.chooseQuestionContainer}>
            <select
              className={styles.questionType}
              defaultValue={''}
              id="questionSelect"
              {...form.register('questionType')}
            >
              <option className={styles.questionTypeOption} value="">
                Выберите тип вопроса
              </option>
              <option className={styles.questionTypeOption} value="single">
                Один из списка
              </option>
              <option className={styles.questionTypeOption} value="multiple">
                Несколько из списка
              </option>
              <option className={styles.questionTypeOption} value="number">
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

            <button
              type="button"
              className={styles.addButton}
              onClick={onAddQuestionClick}
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestFormInfoEdit;

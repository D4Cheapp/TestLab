import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import clsx from 'clsx';
import { testFormType } from '@/src/types/formTypes';
import styles from './TestFormInfoEdit.module.scss';

interface TestFormInfoEditInterface {
  title: string | undefined;
  withDeleteButton: boolean;
  onAddQuestionClick: () => void;
  register: UseFormRegister<testFormType>;
}

function TestFormInfoEdit({
  title,
  withDeleteButton,
  onAddQuestionClick,
  register,
}: TestFormInfoEditInterface): React.ReactNode {
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
          {...register('title')}
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
              {...register('questionSelect')}
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

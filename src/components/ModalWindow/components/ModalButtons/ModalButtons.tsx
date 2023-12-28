import React from 'react';
import clsx from 'clsx';
import { modalWindowType } from '@/src/types/reducerInitialTypes';
import styles from './ModalButtons.module.scss';

interface ModalButtonsInterface {
  windowData: modalWindowType;
  onSaveQuestionClick: () => void;
  onConfirmClick: () => void;
  onCloseWindowClick: () => void;
  onGoToTestListClick: () => void;
}

function ModalButtons({
  windowData,
  onSaveQuestionClick,
  onConfirmClick,
  onCloseWindowClick,
  onGoToTestListClick,
}: ModalButtonsInterface): React.ReactNode {
  return (
    <div className={styles.formButtons}>
      {windowData?.buttons?.withGoToTestButton ? (
        <button
          type="button"
          className={clsx(styles.formButton, styles.goToTestButton)}
          onClick={onGoToTestListClick}
        >
          Вернуться к списку тестов
        </button>
      ) : (
        <>
          {windowData?.buttons?.withConfirmButton ? (
            <button
              type="button"
              className={clsx(styles.formButton, styles.confirmButton)}
              onClick={onConfirmClick}
            >
              Подтвердить
            </button>
          ) : (
            <button
              type="button"
              className={clsx(styles.formButton, styles.saveButton)}
              onClick={onSaveQuestionClick}
            >
              Сохранить
            </button>
          )}
          <button
            type="button"
            className={clsx(styles.formButton, styles.cancelButton)}
            onClick={onCloseWindowClick}
          >
            Отмена
          </button>
        </>
      )}
    </div>
  );
}

export default ModalButtons;

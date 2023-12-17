import React from 'react';
import clsx from 'clsx';
import { modalWindowType } from '@/src/types/reducerInitialTypes';
import styles from './ModalButtons.module.scss';

interface ModalButtonsInterface {
  windowData: modalWindowType;
  onSaveClick: () => void;
  onConfirmClick: () => void;
  onCloseWindowClick: () => void;
  onGoToTestListClick: () => void;
}

function ModalButtons({
  windowData,
  onSaveClick,
  onConfirmClick,
  onCloseWindowClick,
  onGoToTestListClick,
}: ModalButtonsInterface): React.ReactNode {
  return (
    <div className={styles.formButtons}>
      {windowData?.buttons?.withGoBackButton ? (
        <button
          type="button"
          className={clsx(styles.formButton, styles.goBackButton)}
          onClick={() => onGoToTestListClick}
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
              onClick={onSaveClick}
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

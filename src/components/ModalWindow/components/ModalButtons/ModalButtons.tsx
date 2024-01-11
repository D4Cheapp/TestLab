import React from 'react';
import clsx from 'clsx';
import styles from './ModalButtons.module.scss';

interface ModalButtonsInterface {
  confirmAction?: () => void;
  onCloseWindowClick: () => void;
  buttonInfo: {
    confirmTitle?: string;
    withGoHomeButton?: boolean;
    withConfirmButton?: boolean;
  };
}

function ModalButtons({
  confirmAction,
  onCloseWindowClick,
  buttonInfo,
}: ModalButtonsInterface): React.ReactNode {
  return (
    <div className={styles.formButtons}>
      {buttonInfo.withConfirmButton && (
        <button
          type="button"
          className={clsx(styles.formButton, styles.confirmButton)}
          onClick={confirmAction}
        >
          {buttonInfo?.confirmTitle ?? 'Подтвердить'}
        </button>
      )}
      <button
        type="button"
        className={clsx(styles.formButton, styles.cancelButton)}
        onClick={onCloseWindowClick}
      >
        Отмена
      </button>
    </div>
  );
}

export default ModalButtons;

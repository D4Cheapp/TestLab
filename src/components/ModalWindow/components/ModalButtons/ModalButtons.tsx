import React from 'react';
import clsx from 'clsx';
import s from './ModalButtons.module.scss';

interface Props {
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
}: Props): React.ReactNode {
  return (
    <div className={s.formButtons}>
      {buttonInfo.withConfirmButton && (
        <button
          type="button"
          className={clsx(s.formButton, s.confirmButton)}
          onClick={confirmAction}
        >
          {buttonInfo?.confirmTitle ?? 'Подтвердить'}
        </button>
      )}
      <button
        type="button"
        className={clsx(s.formButton, s.cancelButton)}
        onClick={onCloseWindowClick}
      >
        Отмена
      </button>
    </div>
  );
}

export default ModalButtons;

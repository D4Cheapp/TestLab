import React from 'react';
import classNames from 'classnames';
import s from './ModalButtons.module.scss';

interface Props {
  onConfirmClick?: () => void;
  onCloseWindowClick: () => void;
  buttonInfo: {
    confirmTitle?: string;
    withGoHomeButton?: boolean;
    withConfirmButton?: boolean;
  };
}

function ModalButtons({
  onConfirmClick,
  onCloseWindowClick,
  buttonInfo,
}: Props): React.ReactNode {
  return (
    <div className={s.formButtons}>
      {buttonInfo.withConfirmButton && (
        <button
          type="button"
          className={classNames(s.formButton, s.confirmButton)}
          onClick={onConfirmClick}
        >
          {buttonInfo?.confirmTitle ?? 'Подтвердить'}
        </button>
      )}
      <button
        type="button"
        className={classNames(s.formButton, s.cancelButton)}
        onClick={onCloseWindowClick}
      >
        Отмена
      </button>
    </div>
  );
}

export default ModalButtons;

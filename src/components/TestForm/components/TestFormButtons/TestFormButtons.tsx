import React from 'react';
import clsx from 'clsx';
import s from './TestFormButtons.module.scss';

interface Props {
  onGoBackButtonClick: () => void;
  withDeleteButton: boolean;
}

function TestFormButtons({
  onGoBackButtonClick,
  withDeleteButton,
}: Props): React.ReactNode {
  return (
    <div className={s.testFromButtons}>
      {withDeleteButton ? (
        <button type="submit" className={clsx(s.formButton, s.deleteButton)}>
          Удалить
        </button>
      ) : (
        <button type="submit" className={clsx(s.formButton, s.saveButton)}>
          Сохранить
        </button>
      )}

      <button
        type="button"
        className={clsx(s.formButton, s.goBackButton)}
        onClick={onGoBackButtonClick}
      >
        Назад
      </button>
    </div>
  );
}

export default TestFormButtons;

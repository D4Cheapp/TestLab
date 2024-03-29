import React from 'react';
import cn from 'classnames';
import s from './TestFormButtons.module.scss';

interface Props {
  onGoBackButtonClick: () => void;
  withDeleteButton: boolean;
}

const TestFormButtons = ({ onGoBackButtonClick, withDeleteButton }: Props): React.ReactNode => {
  return (
    <div className={s.testFromButtons}>
      {withDeleteButton ? (
        <button type="submit" className={cn(s.formButton, s.deleteButton)}>
          Удалить
        </button>
      ) : (
        <button type="submit" className={cn(s.formButton, s.saveButton)}>
          Сохранить
        </button>
      )}
      <button
        type="button"
        className={cn(s.formButton, s.goBackButton)}
        onClick={onGoBackButtonClick}
      >
        Назад
      </button>
    </div>
  );
};

export default TestFormButtons;

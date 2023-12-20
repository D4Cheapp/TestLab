import React from 'react';
import clsx from 'clsx';
import styles from './TestFormButtons.module.scss';

interface TestFormButtonsInterface {
  onGoBackButtonClick: () => void;
  withDeleteButton: boolean;
}

function TestFormButtons({
  onGoBackButtonClick,
  withDeleteButton,
}: TestFormButtonsInterface): React.ReactNode {
  return (
    <div className={styles.testFromButtons}>
      {withDeleteButton ? (
        <button type="submit" className={clsx(styles.formButton, styles.deleteButton)}>
          Удалить
        </button>
      ) : (
        <button type="submit" className={clsx(styles.formButton, styles.saveButton)}>
          Сохранить
        </button>
      )}

      <button
        type="button"
        className={clsx(styles.formButton, styles.goBackButton)}
        onClick={onGoBackButtonClick}
      >
        Назад
      </button>
    </div>
  );
}

export default TestFormButtons;

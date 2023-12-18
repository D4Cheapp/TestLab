import React from 'react';
import clsx from 'clsx';
import styles from './TestFormButtons.module.scss';

interface TestFormButtonsInterface {
  withDeleteButton: boolean;
}

function TestFormButtons({ withDeleteButton }: TestFormButtonsInterface): React.ReactNode {
  return (
    <div className={styles.testFromButtons}>
      {withDeleteButton ? (
        <button
          type="submit"
          className={clsx(styles.formButton, styles.deleteButton)}
        >
          Удалить
        </button>
      ) : (
        <button
          type="submit"
          className={clsx(styles.formButton, styles.saveButton)}
        >
          Сохранить
        </button>
      )}
    </div>
  );
}

export default TestFormButtons;

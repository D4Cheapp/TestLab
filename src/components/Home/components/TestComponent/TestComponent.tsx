import React from 'react';
import clsx from 'clsx';
import styles from './TestComponent.module.scss';

interface TestComponentInterface {
  title: string;
  testId: number;
  isAdmin: boolean | undefined;
  onPassTestClick: (index: number) => void;
  onEditTestClick: (index: number) => void;
  onDeleteTestClick: (index: number) => void;
}

function TestComponent({
  title,
  testId,
  isAdmin,
  onDeleteTestClick,
  onEditTestClick,
  onPassTestClick,
}: TestComponentInterface): React.ReactNode {
  return (
    <div className={styles.test}>
      <p className={styles.testTitle}>{title}</p>

      <div className={styles.buttonsContainer}>
        <button
          className={clsx(styles.testButton, styles.passTestButton)}
          onClick={() => onPassTestClick(testId)}
        />
        {isAdmin && (
          <>
            <button
              className={clsx(styles.testButton, styles.editTestButton)}
              onClick={() => onEditTestClick(testId)}
            />
            <button
              className={clsx(styles.testButton, styles.deleteTestButton)}
              onClick={() => onDeleteTestClick(testId)}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default TestComponent;

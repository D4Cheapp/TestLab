import React, { useState } from 'react';
import clsx from 'clsx';
import { ModalWindow } from '@/src/components/ModalWindow';
import styles from './TestComponent.module.scss';

interface TestComponentInterface {
  title: string;
  testId: number;
  isAdmin?: boolean;
  onEditTestClick: (index: number) => void;
  onDeleteTestClick: (index: number) => void;
  onPassTestConfirmClick: (index: number) => void;
}

function TestComponent({
  title,
  testId,
  isAdmin,
  onDeleteTestClick,
  onEditTestClick,
  onPassTestConfirmClick,
}: TestComponentInterface): React.ReactNode {
  const [isPassTestWindowActive, setIsPassTestWindowActive] = useState<boolean>(false);
  const onPassTestClick = () => setIsPassTestWindowActive(true);
  const passTestConfirmAction = () => {
    onPassTestConfirmClick(testId);
    setIsPassTestWindowActive(false);
  };

  return (
    <div className={styles.test}>
      {isPassTestWindowActive && (
        <ModalWindow
          title="Начать прохождение теста?"
          confirmAction={passTestConfirmAction}
          buttonInfo={{ withConfirmButton: true }}
          setIsActive={setIsPassTestWindowActive}
        ></ModalWindow>
      )}
      <p className={styles.testTitle} onClick={onPassTestClick}>
        {title}
      </p>

      <div className={styles.buttonsContainer}>
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

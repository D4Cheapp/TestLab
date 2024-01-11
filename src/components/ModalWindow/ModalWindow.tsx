'use client';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { ModalButtons } from './components';
import styles from './ModalWindow.module.scss';

interface ModalWindowInterface {
  setIsActive: Dispatch<SetStateAction<boolean>>;
  confirmAction?: () => void;
  children?: React.ReactNode;
  title: string;
  buttonInfo: {
    confirmTitle?: string;
    withConfirmButton?: boolean;
  };
}

function ModalWindow({
  setIsActive,
  confirmAction,
  children,
  title,
  buttonInfo,
}: ModalWindowInterface): React.ReactNode {
  const onCloseWindowClick = useCallback(() => {
    setIsActive(false);
  }, [setIsActive]);

  const onEscapeKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isEscapePressed = event.key === 'Escape';
      if (isEscapePressed) {
        onCloseWindowClick();
      }
    },
    [onCloseWindowClick],
  );

  useEffect(() => {
    addEventListener('keydown', onEscapeKeyDown);
    return () => removeEventListener('keydown', onEscapeKeyDown);
  }, [onEscapeKeyDown]);

  return (
    <aside className={styles.root}>
      <div className={styles.background} onClick={onCloseWindowClick} />

      <div
        className={clsx(styles.componentFrom, {
          [styles.invisibleContent]: !children,
        })}
      >
        <div className={styles.formHeader}>
          <h1 className={styles.title}>{title}</h1>
          <button className={styles.closeButton} onClick={onCloseWindowClick} />
        </div>

        {children}

        <ModalButtons
          confirmAction={confirmAction}
          onCloseWindowClick={onCloseWindowClick}
          buttonInfo={buttonInfo}
        />
      </div>
    </aside>
  );
}

export default ModalWindow;

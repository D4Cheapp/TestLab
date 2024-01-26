'use client';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { ModalButtons } from './components';
import s from './ModalWindow.module.scss';

interface Props {
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
}: Props): React.ReactNode {
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
    <aside className={s.root}>
      <div className={s.background} onClick={onCloseWindowClick} />

      <div
        className={clsx(s.componentFrom, {
          [s.invisibleContent]: !children,
        })}
      >
        <div className={s.formHeader}>
          <h1 className={s.title}>{title}</h1>
          <button className={s.closeButton} onClick={onCloseWindowClick} />
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

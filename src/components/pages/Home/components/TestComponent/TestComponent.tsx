import React, { useState } from 'react';
import clsx from 'clsx';
import ModalWindow from '@/src/components/common/ModalWindow';
import s from './TestComponent.module.scss';

interface Props {
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
}: Props): React.ReactNode {
  const [isPassTestWindowActive, setIsPassTestWindowActive] = useState<boolean>(false);
  const onPassTestClick = () => setIsPassTestWindowActive(true);
  const passTestConfirmAction = () => {
    onPassTestConfirmClick(testId);
    setIsPassTestWindowActive(false);
  };

  return (
    <div className={s.test}>
      {isPassTestWindowActive && (
        <ModalWindow
          title="Начать прохождение теста?"
          confirmAction={passTestConfirmAction}
          buttonInfo={{ withConfirmButton: true }}
          setIsActive={setIsPassTestWindowActive}
        ></ModalWindow>
      )}
      <p className={s.testTitle} onClick={onPassTestClick}>
        {title}
      </p>

      <div className={s.buttonsContainer}>
        {isAdmin && (
          <>
            <button
              className={clsx(s.testButton, s.editTestButton)}
              onClick={() => onEditTestClick(testId)}
            />
            <button
              className={clsx(s.testButton, s.deleteTestButton)}
              onClick={() => onDeleteTestClick(testId)}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default TestComponent;

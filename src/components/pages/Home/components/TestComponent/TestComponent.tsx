import React, { useState } from 'react';
import cn from 'classnames';
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

const TestComponent = ({
  title,
  testId,
  isAdmin,
  onDeleteTestClick,
  onEditTestClick,
  onPassTestConfirmClick,
}: Props): React.ReactNode => {
  const [isPassTestWindowActive, setIsPassTestWindowActive] = useState<boolean>(false);

  const handlePassTestClick = () => {
    setIsPassTestWindowActive(true);
  };

  const handlePassTestConfirmClick = () => {
    onPassTestConfirmClick(testId);
    setIsPassTestWindowActive(false);
  };

  const handleEditTestClick = () => {
    onEditTestClick(testId);
  };

  const handleDeleteTestClick = () => {
    onDeleteTestClick(testId);
  };

  return (
    <div className={s.test}>
      {isPassTestWindowActive && (
        <ModalWindow
          title="Начать прохождение теста?"
          onConfirmClick={handlePassTestConfirmClick}
          buttonInfo={{ withConfirmButton: true }}
          setIsActive={setIsPassTestWindowActive}
        />
      )}
      <p className={s.testTitle} onClick={handlePassTestClick}>
        {title}
      </p>
      <div className={s.buttonsContainer}>
        {isAdmin && (
          <>
            <button className={cn(s.testButton, s.editTestButton)} onClick={handleEditTestClick} />
            <button
              className={cn(s.testButton, s.deleteTestButton)}
              onClick={handleDeleteTestClick}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TestComponent;

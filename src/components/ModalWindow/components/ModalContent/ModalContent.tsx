import React from 'react';
import clsx from 'clsx';
import { modalWindowType } from '@/src/types/reducerInitialTypes';
import { ModalQuestions } from './ModalQuestions';
import styles from './ModalContent.module.scss';

interface ModalContentInterface {
  windowData: modalWindowType;
}

function ModalContent({ windowData }: ModalContentInterface): React.ReactNode {
  if (!windowData?.content) {
    return null;
  }
  const modalContent = windowData?.content;
  const contentType = modalContent.type;
  const isNumberQuestion =
    contentType === 'question' && modalContent?.questionType === 'number';

  return (
    <div className={clsx(styles.root, { [styles.numberAnswer]: isNumberQuestion })}>
      {(contentType === 'question' && (
        <ModalQuestions questionType={modalContent.questionType} />
      )) ||
        (contentType === 'test-result' && (
          <div className={styles.root}>
            <h2>Результаты теста</h2>
            <p>
              Правильных ответов — ${modalContent?.correct} <br />
              Неправильных ответов — ${modalContent?.wrong}
            </p>
          </div>
        ))}
    </div>
  );
}

export default ModalContent;

import React from 'react';
import { modalWindowType } from '@/src/types/reducerInitialTypes';
import { ModalQuestions, ModalTestResults } from './components';
interface ModalContentInterface {
  windowData: modalWindowType;
}

function ModalContent({ windowData }: ModalContentInterface): React.ReactNode {
  if (!windowData?.content) {
    return null;
  }
  const modalContent = windowData?.content;
  const contentType = modalContent.type;

  return (
    <>
      {(contentType === 'question' && (
        <ModalQuestions questionType={modalContent.questionType} />
      )) ||
        (contentType === 'test-result' && (
          <ModalTestResults correct={modalContent.correct} wrong={modalContent.wrong} />
        ))}
    </>
  );
}

export default ModalContent;

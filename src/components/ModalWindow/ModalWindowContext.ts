import { createContext, RefObject } from 'react';

export type questionAnswerType = {
  id: number;
  text: string;
  is_right: boolean;
  order: number;
};

interface ModalWindowContext {
  title: string | undefined;
  answers: questionAnswerType[];
  currentQuestionNumberAnswer?: number;
  onInputCheck: (id: number) => void;
  onAnswerFocusOut: (event: FocusEvent, id?: number) => void;
  clickEvents: {
    onAddAnswerClick: () => void;
    onDeleteAnswerClick: (index: number) => void;
  };
  refs: {
    answerInputRef: RefObject<HTMLInputElement>;
    numberAnswerRef: RefObject<HTMLInputElement>;
    questionTitleRef: RefObject<HTMLInputElement>;
  };
  dragEvents: {
    onAnswerDragStart: (answer: questionAnswerType) => void;
    onAnswerDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;
    onAnswerDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
    onAnswerDrop: (
      event: React.DragEvent<HTMLDivElement>,
      answer: questionAnswerType,
    ) => void;
  };
}

// @ts-ignore
export const ModalWindowContext = createContext<ModalWindowContext>({});

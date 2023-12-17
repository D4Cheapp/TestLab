import { createContext, RefObject } from 'react';

export type questionAnswerType = {
  answer: { text: string; is_right: boolean };
  dragInfo: { id: number; order: number };
};

interface ModalWindowContext {
  title: string | undefined;
  answers: questionAnswerType[];
  numberAnswer: number | undefined;
  onInputCheck: (id: number) => void;
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

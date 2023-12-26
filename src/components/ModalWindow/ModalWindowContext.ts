import { createContext, Dispatch, RefObject, SetStateAction } from 'react';

export type questionAnswerType = {
  id: number;
  isLocalInfo?: boolean;
  isLocalPosition?: boolean;
  isDeleted?: boolean;
  isCreated?: boolean;
  position: number;
  text: string;
  is_right: boolean;
};

interface ModalWindowContext {
  title: string | undefined;
  answers: questionAnswerType[];
  currentQuestionNumberAnswer?: number;
  setAnswers: Dispatch<SetStateAction<questionAnswerType[]>>;
  refs: {
    numberAnswerRef: RefObject<HTMLInputElement>;
    questionTitleRef: RefObject<HTMLInputElement>;
  };
}

// @ts-ignore
export const ModalWindowContext = createContext<ModalWindowContext>({});

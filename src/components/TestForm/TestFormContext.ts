import { Dispatch, SetStateAction, createContext } from 'react';
import {
  UseFormGetValues,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
} from 'react-hook-form';
import { testFormType } from '@/src/types/formTypes';
import { createQuestionRequestType } from '@/src/types/requestTypes';

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

type TestFormContext = {
  answers: questionAnswerType[];
  withDeleteButton: boolean;
  currentQuestion?: createQuestionRequestType;
  setAnswers: Dispatch<SetStateAction<questionAnswerType[]>>;
  onQuestionModifyClick: (isEdit: boolean) => boolean;
  setCurrentQuestion: Dispatch<SetStateAction<createQuestionRequestType | undefined>>;
  onDeleteQuestionConfirmClick: (id: number) => void;
  form: {
    getValues: UseFormGetValues<testFormType>;
    setValue: UseFormSetValue<testFormType>;
    register: UseFormRegister<testFormType>;
    reset: UseFormReset<testFormType>;
  };
};

//@ts-ignore
export const TestFormContext = createContext<TestFormContext>({});

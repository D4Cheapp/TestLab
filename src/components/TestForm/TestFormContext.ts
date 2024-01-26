import { Dispatch, SetStateAction, createContext } from 'react';
import {
  UseFormGetValues,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
} from 'react-hook-form';
import { TestFormType } from '@/src/types/formTypes';
import { CreateQuestionRequestType } from '@/src/types/requestTypes';

export type QuestionAnswerType = {
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
  answers: QuestionAnswerType[];
  withDeleteButton: boolean;
  currentQuestion?: CreateQuestionRequestType;
  setAnswers: Dispatch<SetStateAction<QuestionAnswerType[]>>;
  onQuestionModifyClick: (isEdit: boolean) => boolean;
  setCurrentQuestion: Dispatch<SetStateAction<CreateQuestionRequestType | undefined>>;
  onDeleteQuestionConfirmClick: (id: number) => void;
  form: {
    getValues: UseFormGetValues<TestFormType>;
    setValue: UseFormSetValue<TestFormType>;
    register: UseFormRegister<TestFormType>;
    reset: UseFormReset<TestFormType>;
  };
};

//@ts-ignore
export const TestFormContext = createContext<TestFormContext>({});

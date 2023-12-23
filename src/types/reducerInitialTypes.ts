import { createQuestionRequestType } from './requestTypes';

export type currentProfileType =
  | { id: number; username: string; is_admin: boolean }
  | null
  | undefined;
export type modalWindowType =
  | {
      title: string;
      isEdit?: boolean;
      content?:
        | {
            type: 'question';
            questionType: 'single' | 'multiple' | 'number';
            isLocal: boolean;
          }
        | {
            type: 'test-result';
            wrong: number;
            correct: number;
          }
        | {
            type: 'test-pass';
            id: number;
          };
      buttons?: {
        delete?: {
          deleteTarget: 'test' | 'question';
          id: number;
        };
        save?: {
          saveTarget: 'test' | 'question';
          title?: string;
          id?: number;
        };
        withGoBackButton?: boolean;
        withConfirmButton?: boolean;
      };
    }
  | undefined;
export type questionDataType = {
  question: createQuestionRequestType;
  answer?: number;
  answers?: {
    id: number;
    text: string;
    is_right: boolean;
  }[];
  id: number;
};
export type currentTestType =
  | {
      id?: number;
      title?: string;
      questions?: questionDataType[];
    }
  | undefined;

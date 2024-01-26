import { CreateQuestionRequestType } from './requestTypes';

export type CurrentProfileType = {
  id: number;
  username: string;
  is_admin: boolean;
} | null;
export type CurrentTestType = {
  id?: number;
  title?: string;
  questions?: CreateQuestionRequestType[];
};

import { createQuestionRequestType } from './requestTypes';

export type currentProfileType = {
  id: number;
  username: string;
  is_admin: boolean;
} | null;
export type currentTestType = {
  id?: number;
  title?: string;
  questions?: createQuestionRequestType[];
};

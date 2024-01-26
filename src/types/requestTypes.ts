import { QuestionAnswerType } from '../components/pages/TestForm/TestFormContext';

export type RequestTypesType = 'GET' | 'POST' | 'PATCH' | 'DELETE';
export type ProfileLoginRequestType = { username: string; password: string };
export type ProfileRegisterRequestType = ProfileLoginRequestType & {
  password_confirmation: string;
  is_admin: boolean;
};
export type CreateTestRequestType = {
  title: string;
  questions?: CreateQuestionRequestType[];
};
export type PaginationTestRequestType = {
  page: number;
  per: number;
  search: string;
  sort: string;
};
export type CreateQuestionRequestType = {
  test_id?: number;
  id?: number;
  title: string;
  question_type: 'single' | 'multiple' | 'number';
  isQuestionLocal?: boolean;
  answer?: number;
  answers?: QuestionAnswerType[];
};
export type CreateAnswerRequestType = { text: string; is_right: boolean };

export type requestTypesType = 'GET' | 'POST' | 'PATCH' | 'DELETE';
export type profileLoginRequestType = { username: string; password: string };
export type profileRegisterRequestType = profileLoginRequestType & {
  password_confirmation: string;
  is_admin: boolean;
};
export type createTestRequestType = { title: string };
export type paginationTestRequestType = {
  page: number;
  per: number;
  search: string;
  sort: string;
};
export type createQuestionRequestType = {
  test_id?: number;
  title: string;
  question_type: 'single' | 'multiple' | 'number';
  answer: number;
};
export type createAnswerRequestType = { text: string; is_right: boolean };

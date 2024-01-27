export type ProfileAuthReceiveType = {
  id: number;
  is_admin: boolean;
  username: string;
};
export type ProfileLogoutReceiveType = { success: boolean };
export type CreateAnswerReceiveType = {
  id: number;
  is_right: boolean;
  text: string;
};
export type CreateQuestionReceiveType = {
  id: number;
  answer: number;
  answers: CreateAnswerReceiveType[];
  question_type: 'single' | 'multiple' | 'number';
  title: string;
};
export type TestReceiveType = {
  id: number;
  created_at: string;
  title: string;
  questions: CreateQuestionReceiveType[];
};
export type PaginationTestsReceiveType = {
  meta: { total_pages: number; total_count: number };
  tests: TestReceiveType[];
};
export type DeleteReceiveType = { status: 'ok' | 'not-found' };
export type MoveAnswerReceiveType = DeleteReceiveType;

export type profileAuthReceiveType = { id: number; is_admin: boolean; username: string };
export type profileLogoutReceiveType = { success: boolean };
export type createAnswerReceiveType = { id: number; is_right: boolean; text: string };
export type createQuestionReceiveType = {
  id: number;
  answer: number;
  answers: createAnswerReceiveType[];
  question_type: 'single' | 'multiple' | 'number';
  title: string;
};
export type testReceiveType = {
  id: number;
  created_at: string;
  title: string;
  questions: createQuestionReceiveType[];
};
export type paginationTestsReceiveType = {
  meta: { total_pages: number; total_count: number };
  tests: testReceiveType[];
};
export type deleteReceiveType = { status: 'ok' | 'not-found' };
export type moveAnswerReceiveType = deleteReceiveType;

export type profileAuthReceiveType = { id: number; is_admin: boolean; username: string };
export type profileLogoutReceiveType = { success: boolean };
export type createAnswerReciveType = { id: number; is_right: boolean; text: string };
export type createQuestionRecieveType = {
  id: number;
  answer: number;
  answers: createAnswerReciveType[];
  question_type: 'single' | 'multiple' | 'number';
  title: string;
};
export type testReceiveType = {
  id: number;
  created_at: string;
  title: string;
  questions: createQuestionRecieveType[];
};
export type paginationTestsReceiveType = {
  meta: { total_pages: number; total_count: number };
  tests: testReceiveType[];
};
export type deleteRecieveType = { status: 'ok' | 'not-found' };
export type changeAnswerPositionRecieveType = deleteRecieveType;

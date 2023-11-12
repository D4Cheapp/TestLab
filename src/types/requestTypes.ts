export type requestTypesType = 'GET' | 'POST' | 'PATCH' | 'DELETE';
export type loginInfoType = { username: string; password: string };
export type registerInfoType = loginInfoType & { password_confirmation: string; is_admin: boolean };
export type testCreateType = { title: string };
export type testPaginationType = { page: number; per: number; search: string; sort: string };
export type questionCreateType = {
  title: string;
  question_type: 'single' | 'multiple' | 'number';
  answer: number;
};
export type answerCreateType = { text: string; is_right: boolean };

export type EntryFormType = {
  username: string;
  password: string;
  is_admin?: boolean;
  password_confirmation?: string;
};
export type TestFormType = {
  testTitle: string;
  questionType: 'single' | 'multiple' | 'number';
  questionTitle: string;
  answerVariant: string;
  numberAnswer: string;
};

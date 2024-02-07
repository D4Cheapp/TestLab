export type EntryFormType = {
  is_admin: boolean;
  username: string;
  password: string;
  password_confirmation?: string;
};
export type TestFormType = {
  title: string;
  questionType: 'single' | 'multiple' | 'number';
  questionTitle: string;
  answerInput: string;
  numberAnswer: number;
};

export type entryFormType = {
  is_admin: boolean;
  username: string;
  password: string;
  password_confirmation?: string;
};

export type testFormType = {
  title: string;
  questionSelect: string;
};

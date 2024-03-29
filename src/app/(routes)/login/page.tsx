import React from 'react';
import EntryForm from '@/src/components/pages/EntryForm';

const Login = (): React.ReactNode => {
  return (
    <EntryForm
      redirectTo="/register"
      title="Войдите в аккаунт"
      submitTitle="Войти"
      redirectTitle="Нет учетной записи?"
    />
  );
};

export default Login;

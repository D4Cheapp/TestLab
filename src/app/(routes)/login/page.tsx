import React from 'react';
import { EntryForm } from '@/src/components';

function Login(): React.ReactNode {
  return (
    <EntryForm
      redirectTo="/register"
      title="Войдите в аккаунт"
      submitTitle="Войти"
      redirectTitle="Нет учетной записи?"
    />
  );
}

export default Login;

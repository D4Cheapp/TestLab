import React from 'react';
import EntryForm from '@/src/components/pages/EntryForm';

function Register(): React.ReactNode {
  return (
    <EntryForm
      redirectTo="/login"
      title="Создайте учетную запись"
      submitTitle="Зарегистрироваться"
      redirectTitle="Уже есть аккаунт?"
      isRegister
    />
  );
}

export default Register;

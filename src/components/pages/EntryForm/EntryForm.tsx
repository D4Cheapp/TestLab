'use client';
import React, { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useActions, useAppSelector } from '@/src/hooks/reduxHooks';
import { EntryFormType } from '@/src/types/formTypes';
import { currentProfileSelector } from '@/src/reduxjs/auth/selectors';
import EntryInput from './EntryInput';
import s from './EntryForm.module.scss';

interface Props {
  redirectTo: string;
  title: string;
  submitTitle: string;
  redirectTitle: string;
  isRegister?: boolean;
}

function EntryForm({
  redirectTo,
  title,
  submitTitle,
  redirectTitle,
  isRegister = false,
}: Props) {
  const { register, handleSubmit, formState } = useForm<EntryFormType>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordMatchError, setIsPasswordMatchError] = useState(false);
  const currentProfile = useAppSelector(currentProfileSelector);
  const router = useRouter();
  const { setErrorsState, profileLogin, profileRegister } = useActions();

  const handleShowPasswordClick = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const handleShowConfirmPasswordClick = useCallback(() => {
    setShowConfirmPassword(!showConfirmPassword);
  }, [showConfirmPassword]);

  const handlePasswordClick = useCallback(() => {
    setIsPasswordMatchError(false);
  }, []);

  const handleFormSubmit: SubmitHandler<EntryFormType> = (data, event) => {
    event?.preventDefault();
    const valuesArray = Object.values(data).map((value) =>
      typeof value === 'string' ? (!!value.trim() ? value : undefined) : value,
    );
    const isProfileInfoEmpty = valuesArray.includes(undefined);
    if (isProfileInfoEmpty) {
      setErrorsState('Error: Fill in all the necessary data');
      return false;
    }
    if (isRegister) {
      const isPasswordShort = data.password.length < 10;
      const isPasswordMissingUpperChar = !/[A-Z,А-Я]/.test(data.password);
      const isPasswordMissingNumber = !/\d/.test(data.password);
      const isPasswordMatchError = data.password !== data.password_confirmation;
      if (isPasswordShort) {
        setErrorsState('Error: Password should contain at least 10 character');
        return false;
      }
      if (isPasswordMissingUpperChar) {
        setErrorsState('Error: Password should contain at least one capital letter');
        return false;
      }
      if (isPasswordMissingNumber) {
        setErrorsState('Error: Password should contain at least one number');
        return false;
      }
      if (isPasswordMatchError) {
        setIsPasswordMatchError(true);
        return false;
      } else {
        setIsPasswordMatchError(false);
      }
    }
    // @ts-ignore
    isRegister ? profileRegister(data) : profileLogin(data);
    return true;
  };

  const handleRedirectClick = () => {
    router.push(redirectTo);
  };

  useEffect(() => {
    const isDataCorrectAndSent = formState.isSubmitSuccessful && currentProfile?.id;
    if (isDataCorrectAndSent) {
      router.push('/');
    }
  }, [currentProfile?.id, formState.isSubmitSuccessful, router]);

  return (
    <div className={s.formContainer}>
      <form
        className={s.form}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(handleFormSubmit)}
        name="EntryForm"
      >
        <h1 className={s.title}>{title}</h1>
        <EntryInput
          title="Логин"
          name="username"
          register={register}
          isPassword={false}
        />
        <EntryInput
          isPassword
          title="Пароль"
          name="password"
          register={register}
          isShownPassword={showPassword}
          onPasswordClick={handlePasswordClick}
          onShowPasswordClick={handleShowPasswordClick}
          isPasswordMatchError={isPasswordMatchError}
        />
        {isRegister && (
          <>
            <div className={s.confirmPasswordContainer}>
              <EntryInput
                isPassword
                title="Подтвердите пароль"
                name="password_confirmation"
                register={register}
                isShownPassword={showConfirmPassword}
                onPasswordClick={handlePasswordClick}
                onShowPasswordClick={handleShowConfirmPasswordClick}
                isPasswordMatchError={isPasswordMatchError}
              />
              {isPasswordMatchError && (
                <p className={s.matchErrorTitle}>Ошибка: пароли не совпадают</p>
              )}
            </div>
            <label className={s.isAdmin}>
              <p className={s.isAdminTitle}>Учетная запись администратора</p>
              <input
                className={s.checkbox}
                type="checkbox"
                defaultChecked={false}
                id="is_admin"
                {...register('is_admin')}
              />
              <div className={s.customCheckbox} />
            </label>
          </>
        )}
        <div className={s.additionalContent}>
          <button className={s.submit} type="submit">
            {submitTitle}
          </button>
          <button type="button" className={s.redirectLink} onClick={handleRedirectClick}>
            {redirectTitle}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EntryForm;

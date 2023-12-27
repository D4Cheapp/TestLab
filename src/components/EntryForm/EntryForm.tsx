'use client';
import React, { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { entryFormType } from '@/src/types/formTypes';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { setErrorsState } from '@/src/reduxjs/reducers/baseReducer';
import { profileLogin, profileRegister } from '@/src/reduxjs/reducers/authReducer';
import { EntryInput } from './EntryInput';
import styles from './EntryForm.module.scss';

interface EntryFormInterface {
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
}: EntryFormInterface) {
  const { register, handleSubmit, formState } = useForm<entryFormType>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const currentProfile = useAppSelector((state) => state.auth.currentProfile);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onShowPasswordClick = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const onShowConfirmPasswordClick = useCallback(() => {
    setShowConfirmPassword(!showConfirmPassword);
  }, [showConfirmPassword]);

  const onSubmitFunc: SubmitHandler<entryFormType> = (data, event) => {
    event?.preventDefault();
    const valuesArray = Object.values(data).map((value) =>
      typeof value === 'string' ? (!!value.trim() ? value : undefined) : value,
    );
    const isProfileInfoEmpty = valuesArray.includes(undefined);

    if (isProfileInfoEmpty) {
      dispatch(setErrorsState('Error: Fill in all the necessary data'));
      return false;
    }

    const isRegisterDataCorrect =
      isRegister && data.password !== data.password_confirmation;
    if (isRegisterDataCorrect) {
      dispatch(setErrorsState("Error: Passwords don't match"));
      return false;
    }

    // @ts-ignore
    dispatch(isRegister ? profileRegister(data) : profileLogin(data));
    return true;
  };

  const onRedirectClick = () => {
    router.push(redirectTo);
  };

  useEffect(() => {
    const isDataCorrectAndSent = formState.isSubmitSuccessful && currentProfile?.id;
    if (isDataCorrectAndSent) {
      router.push('/');
    }
  }, [currentProfile?.id, formState.isSubmitSuccessful, router]);

  return (
    <div className={styles.formContainer}>
      <form
        className={styles.form}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmitFunc)}
        name="EntryForm"
      >
        <h1 className={styles.title}>{title}</h1>

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
          onShowPasswordClick={onShowPasswordClick}
        />

        {isRegister && (
          <>
            <EntryInput
              isPassword
              title="Подтвердите пароль"
              name="password_confirmation"
              register={register}
              isShownPassword={showConfirmPassword}
              onShowPasswordClick={onShowConfirmPasswordClick}
            />

            <label className={styles.isAdmin}>
              <p className={styles.isAdminTitle}>Учетная запись администратора</p>

              <input
                className={styles.checkbox}
                type="checkbox"
                defaultChecked={false}
                id="is_admin"
                {...register('is_admin')}
              />

              <div className={styles.customCheckbox} />
            </label>
          </>
        )}

        <div className={styles.additionalContent}>
          <button className={styles.submit} type="submit">
            {submitTitle}
          </button>

          <button type="button" className={styles.redirectLink} onClick={onRedirectClick}>
            {redirectTitle}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EntryForm;

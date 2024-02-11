'use client';
import React, { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { useActions, useAppSelector } from '@/src/hooks/reduxHooks';
import { currentProfileSelector } from '@/src/reduxjs/auth/selectors';
import { EntryFormType } from '@/src/types/formTypes';
import EntryInput from './EntryInput';
import s from './EntryForm.module.scss';

interface Props {
  redirectTo: string;
  title: string;
  submitTitle: string;
  redirectTitle: string;
  isRegister?: boolean;
}

const EntryForm = ({
  redirectTo,
  title,
  submitTitle,
  redirectTitle,
  isRegister = false,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormSubmit, setIsFormSubmit] = useState(false);
  const currentProfile = useAppSelector(currentProfileSelector);
  const router = useRouter();
  const { profileLogin, profileRegister } = useActions();

  const handleShowPasswordClick = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const handleShowConfirmPasswordClick = useCallback(() => {
    setShowConfirmPassword(!showConfirmPassword);
  }, [showConfirmPassword]);

  const handleFormSubmit = (values: EntryFormType): void => {
    //@ts-ignore
    isRegister ? profileRegister(values) : profileLogin(values);
    setIsFormSubmit(true);
  };

  const handleRegisterFormValidation = isRegister
    ? {
        is_admin: Yup.boolean(),
        password: Yup.string()
          .required('Ошибка: Заполните все необходимые данные')
          .min(10, 'Ошибка: Пароль должен содержать не менее 10 символов')
          .matches(/[A-Z,А-Я]/, 'Ошибка: Пароль должен содержать хотя бы одну заглавную букву')
          .matches(/[+-]?\d+(?:\.\d+)?/, 'Ошибка: Пароль должен содержать хотя бы одно число'),
        password_confirmation: Yup.string()
          .required('Ошибка: Заполните все необходимые данные')
          .oneOf([Yup.ref('password')], 'Ошибка: Пароли не совпадают'),
      }
    : null;

  const handleLoginFormValidation = {
    password: Yup.string().required('Ошибка: Заполните все необходимые данные'),
    username: Yup.string().required('Ошибка: Заполните все необходимые данные'),
  };

  useEffect(() => {
    const isDataCorrectAndSent = isFormSubmit && currentProfile?.id;
    if (isDataCorrectAndSent) {
      router.push('/');
    }
  }, [currentProfile?.id, isFormSubmit, router]);

  return (
    <div className={s.formContainer}>
      <Formik
        initialValues={
          {
            is_admin: false,
            password: '',
            username: '',
            password_confirmation: '',
          } as EntryFormType
        }
        validationSchema={Yup.object({
          ...handleLoginFormValidation,
          ...handleRegisterFormValidation,
        })}
        onSubmit={handleFormSubmit}
      >
        {({ errors }) => (
          <Form className={s.form}>
            <h1 className={s.title}>{title}</h1>
            <EntryInput title="Логин" name="username" isPassword={false} error={errors.username} />
            <EntryInput
              isPassword
              title="Пароль"
              name="password"
              isShownPassword={showPassword}
              onShowPasswordClick={handleShowPasswordClick}
              error={errors.password}
            />
            {isRegister && (
              <>
                <EntryInput
                  isPassword
                  title="Подтвердите пароль"
                  name="password_confirmation"
                  isShownPassword={showConfirmPassword}
                  onShowPasswordClick={handleShowConfirmPasswordClick}
                  error={errors.password_confirmation}
                />
                <label className={s.isAdmin}>
                  <p className={s.isAdminTitle}>Учетная запись администратора</p>
                  <Field className={s.checkbox} type="checkbox" name="is_admin" id="is_admin" />
                  <div className={s.customCheckbox} />
                </label>
              </>
            )}
            <div className={s.additionalContent}>
              <button className={s.submit} type="submit">
                {submitTitle}
              </button>
              <Link href={redirectTo} className={s.redirectLink}>
                {redirectTitle}
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EntryForm;

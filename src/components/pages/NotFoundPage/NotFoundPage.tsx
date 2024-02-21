import React from 'react';
import Link from 'next/link';
import s from './NotFoundPage.module.scss';

const NotFoundPage = (): React.ReactNode => {
  return (
    <div className={s.root}>
      <div className={s.errorContainer}>
        <h1 className={s.title}>Страница не найдена</h1>
        <Link href="/" className={s.goBack}>
          Вернуться на главную страницу
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

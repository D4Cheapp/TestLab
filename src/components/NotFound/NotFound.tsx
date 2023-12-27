import React from 'react';
import Link from 'next/link';
import styles from './NotFound.module.scss';

interface NotFoundInterface {}

function NotFound({}: NotFoundInterface): React.ReactNode {

  return (
    <div className={styles.root}>
      <div className={styles.errorContainer}>
        <h1 className={styles.title}>Страница не найдена</h1>
        <Link href={'/'} className={styles.goBack}>
          Вернуться на главную страницу
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

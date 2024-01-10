import React, { ChangeEventHandler } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './HomeNavbar.module.scss';

interface HomeNavbarInterface {
  isReverseDate: boolean;
  defaultFilterValue: string;
  onFilterReverseClick: () => void;
  onLogoutClick: () => void;
  onFilterInput: ChangeEventHandler;
}

function HomeNavbar({
  isReverseDate,
  defaultFilterValue,
  onFilterReverseClick,
  onLogoutClick,
  onFilterInput,
}: HomeNavbarInterface): React.ReactNode {
  return (
    <nav className={styles.nav}>
      <h1 className={styles.navTitle}>TestLab</h1>

      <input
        className={styles.filter}
        type="text"
        onChange={onFilterInput}
        placeholder="Поиск по тестам"
        name="FilterInput"
        id="FilterInput"
        defaultValue={defaultFilterValue}
      />

      <div className={styles.secondLine}>
        <button className={styles.dateSort} onClick={onFilterReverseClick}>
          <p className={styles.sortButtonTitle}>Сортировка по дате</p>
          <div className={clsx(styles.arrow, { [styles.reverseDate]: isReverseDate })} />
        </button>

        <Link href={'/login'} className={styles.logout} onClick={onLogoutClick}>
          Выйти из профиля
        </Link>
      </div>
    </nav>
  );
}

export default HomeNavbar;

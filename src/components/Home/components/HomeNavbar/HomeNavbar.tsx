import React from 'react';
import Link from 'next/link';
import styles from './HomeNavbar.module.scss';

interface HomeNavbarInterface {
  onFilterReverseClick: () => void;
  onLogoutClick: () => void;
  isReverseDate: boolean;
}

function HomeNavbar({
  onFilterReverseClick,
  onLogoutClick,
  isReverseDate,
}: HomeNavbarInterface): React.ReactNode {
  return (
    <nav className={styles.nav}>
      <h1 className={styles.navTitle}>TestLab</h1>

      <input
        className={styles.filter}
        type="text"
        placeholder="Введите фильтр тестов"
        name="FilterInput"
      />

      <div className={styles.secondLine}>
        <button className={styles.dateSort} onClick={onFilterReverseClick}>
          Сортировка по дате {isReverseDate ? '↓' : '↑'}
        </button>

        <Link href={'/login'} className={styles.logout} onClick={onLogoutClick}>
          Выйти из профиля
        </Link>
      </div>
    </nav>
  );
}

export default HomeNavbar;

import React, { ChangeEventHandler, Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';
import { ModalWindow } from '@/src/components/ModalWindow';
import styles from './HomeNavbar.module.scss';

interface HomeNavbarInterface {
  isReverseDate: boolean;
  defaultFilterValue: string;
  isLogoutWindowActive: boolean;
  setLogoutWindowActive: Dispatch<SetStateAction<boolean>>;
  onFilterReverseClick: () => void;
  onLogoutClick: () => void;
  onLogoutConfirmClick: () => void;
  onFilterInput: ChangeEventHandler;
}

function HomeNavbar({
  isReverseDate,
  defaultFilterValue,
  isLogoutWindowActive,
  setLogoutWindowActive,
  onLogoutConfirmClick,
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

        {isLogoutWindowActive && (
          <ModalWindow
            title="Вы действительно хотите выйти из профиля?"
            buttonInfo={{ withConfirmButton: true }}
            setIsActive={setLogoutWindowActive}
            confirmAction={onLogoutConfirmClick}
          />
        )}

        <button className={styles.logout} onClick={onLogoutClick}>
          Выйти из профиля
        </button>
      </div>
    </nav>
  );
}

export default HomeNavbar;

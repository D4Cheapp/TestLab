import React, { ChangeEventHandler, Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import ModalWindow from '@/src/components/common/ModalWindow';
import s from './HomeNavbar.module.scss';

interface Props {
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
}: Props): React.ReactNode {
  return (
    <nav className={s.nav}>
      <h1 className={s.navTitle}>TestLab</h1>

      <input
        className={s.filter}
        type="text"
        onChange={onFilterInput}
        placeholder="Поиск по тестам"
        name="FilterInput"
        id="FilterInput"
        defaultValue={defaultFilterValue}
      />

      <div className={s.secondLine}>
        <button className={s.dateSort} onClick={onFilterReverseClick}>
          <p className={s.sortButtonTitle}>Сортировка по дате</p>
          <div className={classNames(s.arrow, { [s.reverseDate]: isReverseDate })} />
        </button>

        {isLogoutWindowActive && (
          <ModalWindow
            title="Вы действительно хотите выйти из профиля?"
            buttonInfo={{ withConfirmButton: true }}
            setIsActive={setLogoutWindowActive}
            confirmAction={onLogoutConfirmClick}
          />
        )}

        <button className={s.logout} onClick={onLogoutClick}>
          Выйти из профиля
        </button>
      </div>
    </nav>
  );
}

export default HomeNavbar;
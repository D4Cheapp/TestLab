import React, { ChangeEventHandler, Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import ModalWindow from '@/src/components/common/ModalWindow';
import CustomInput from '@/src/components/common/CustomInput';
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

const HomeNavbar = ({
  isReverseDate,
  defaultFilterValue,
  isLogoutWindowActive,
  setLogoutWindowActive,
  onLogoutConfirmClick,
  onFilterReverseClick,
  onLogoutClick,
  onFilterInput,
}: Props): React.ReactNode => {
  return (
    <nav className={s.nav}>
      <h1 className={s.navTitle}>TestLab</h1>
      <CustomInput
        classNames={{input: s.filter}}
        placeholder="Поиск по тестам"
        name="FilterInput"
        onChange={onFilterInput}
        defaultValue={defaultFilterValue}
      />
      <div className={s.secondLine}>
        <button className={s.dateSort} onClick={onFilterReverseClick}>
          <p className={s.sortButtonTitle}>Сортировка по дате</p>
          <div className={cn(s.arrow, { [s.reverseDate]: isReverseDate })} />
        </button>
        {isLogoutWindowActive && (
          <ModalWindow
            title="Вы действительно хотите выйти из профиля?"
            buttonInfo={{ withConfirmButton: true }}
            setIsActive={setLogoutWindowActive}
            onConfirmClick={onLogoutConfirmClick}
          />
        )}
        <button className={s.logout} onClick={onLogoutClick}>
          Выйти из профиля
        </button>
      </div>
    </nav>
  );
};

export default HomeNavbar;

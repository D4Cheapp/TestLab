import clsx from 'clsx';
import { UseFormRegister } from 'react-hook-form';
import { entryFormType } from '@/src/types/formTypes';
import styles from './EntryInput.module.scss';

interface EntryInputInterface {
  isPassword: boolean;
  title: string;
  name: 'is_admin' | 'username' | 'password' | 'password_confirmation';
  register: UseFormRegister<entryFormType>;
  onShowPasswordClick?: () => void;
  isShownPassword?: boolean;
}

function EntryInput({
  isPassword,
  title,
  name,
  register,
  onShowPasswordClick = (): void => {},
  isShownPassword = false,
}: EntryInputInterface) {
  return (
    <div className={styles.inputContainer}>
      <input
        className={styles.input}
        type={isPassword ? (isShownPassword ? 'text' : 'password') : 'text'}
        required
        placeholder={title}
        id={name}
        {...register(name, { required: true })}
      />

      <div className={styles.inputLabel}>{title}</div>

      {isPassword && (
        <button
          type="button"
          onClick={onShowPasswordClick}
          className={clsx(styles.passwordEye, {
            [styles.showPassword]: isShownPassword,
            [styles.hidePassword]: !isShownPassword,
          })}
        />
      )}
    </div>
  );
}

export default EntryInput;

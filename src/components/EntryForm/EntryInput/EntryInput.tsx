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
  onPasswordClick?: () => void;
  isShownPassword?: boolean;
  isPasswordMatchError?: boolean;
}

function EntryInput({
  isPassword,
  title,
  name,
  register,
  onShowPasswordClick,
  onPasswordClick,
  isShownPassword = false,
  isPasswordMatchError = false,
}: EntryInputInterface) {
  return (
    <div className={styles.inputContainer}>
      <input
        className={clsx(styles.input, { [styles.passwordError]: isPasswordMatchError })}
        type={isPassword ? (isShownPassword ? 'text' : 'password') : 'text'}
        required
        placeholder={title}
        onClick={() => (onPasswordClick ? onPasswordClick() : undefined)}
        id={name}
        {...register(name, { required: true })}
      />

      <div
        className={clsx(styles.inputLabel, { [styles.errorTitle]: isPasswordMatchError })}
      >
        {title}
      </div>

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

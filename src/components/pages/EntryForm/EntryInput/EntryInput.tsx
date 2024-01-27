import { UseFormRegister } from 'react-hook-form';
import classNames from 'classnames';
import { EntryFormType } from '@/src/types/formTypes';
import s from './EntryInput.module.scss';

interface Props {
  isPassword: boolean;
  title: string;
  name: 'is_admin' | 'username' | 'password' | 'password_confirmation';
  register: UseFormRegister<EntryFormType>;
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
}: Props) {
  return (
    <div className={s.inputContainer}>
      <input
        className={classNames(s.input, { [s.passwordError]: isPasswordMatchError })}
        type={isPassword ? (isShownPassword ? 'text' : 'password') : 'text'}
        required
        placeholder={title}
        onClick={() => (onPasswordClick ? onPasswordClick() : undefined)}
        id={name}
        {...register(name, { required: true })}
      />

      <div className={classNames(s.inputLabel, { [s.errorTitle]: isPasswordMatchError })}>
        {title}
      </div>

      {isPassword && (
        <button
          type="button"
          onClick={onShowPasswordClick}
          className={classNames(s.passwordEye, {
            [s.showPassword]: isShownPassword,
            [s.hidePassword]: !isShownPassword,
          })}
        />
      )}
    </div>
  );
}

export default EntryInput;

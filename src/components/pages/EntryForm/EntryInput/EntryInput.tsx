import { UseFormRegister } from 'react-hook-form';
import cn from 'classnames';
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

const EntryInput = ({
  isPassword,
  title,
  name,
  register,
  onShowPasswordClick,
  onPasswordClick,
  isShownPassword = false,
  isPasswordMatchError = false,
}: Props) => {
  return (
    <div className={s.inputContainer}>
      <input
        className={cn(s.input, { [s.passwordError]: isPasswordMatchError })}
        type={isPassword ? (isShownPassword ? 'text' : 'password') : 'text'}
        required
        placeholder={title}
        onClick={() => (onPasswordClick ? onPasswordClick() : undefined)}
        id={name}
        {...register(name, { required: true })}
      />
      <div className={cn(s.inputLabel, { [s.errorTitle]: isPasswordMatchError })}>
        {title}
      </div>
      {isPassword && (
        <button
          type="button"
          onClick={onShowPasswordClick}
          className={cn(s.passwordEye, {
            [s.showPassword]: isShownPassword,
            [s.hidePassword]: !isShownPassword,
          })}
        />
      )}
    </div>
  );
};

export default EntryInput;

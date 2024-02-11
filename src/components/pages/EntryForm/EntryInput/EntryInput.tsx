import cn from 'classnames';
import { Field } from 'formik';
import s from './EntryInput.module.scss';

interface Props {
  isPassword: boolean;
  title: string;
  name: 'is_admin' | 'username' | 'password' | 'password_confirmation';
  onShowPasswordClick?: () => void;
  error?: string;
  isShownPassword?: boolean;
}

const EntryInput = ({
  isPassword,
  title,
  name,
  onShowPasswordClick,
  error,
  isShownPassword = false,
}: Props) => {
  return (
    <div className={s.entryInputContainer}>
      <div className={s.inputContainer}>
        <Field
          className={cn(s.input, { [s.passwordError]: error })}
          type={isPassword ? (isShownPassword ? 'text' : 'password') : 'text'}
          placeholder={title}
          name={name}
          id={name}
        />
        <div className={cn(s.inputLabel, { [s.errorTitle]: error })}>{title}</div>
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
      {!!error && <p className={s.matchErrorTitle}>{error}</p>}
    </div>
  );
};

export default EntryInput;

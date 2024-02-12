import cn from 'classnames';
import CustomInput from '@/src/components/common/CustomInput';
import s from './EntryInput.module.scss';

interface Props {
  isPassword: boolean;
  title: string;
  name: 'is_admin' | 'username' | 'password' | 'password_confirmation';
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShowPasswordClick?: () => void;
  error?: string;
  isShownPassword?: boolean;
}

const EntryInput = ({
  isPassword,
  title,
  name,
  handleChange,
  onShowPasswordClick,
  error,
  isShownPassword = false,
}: Props) => {
  return (
    <div className={s.entryInputContainer}>
      <div className={s.inputContainer}>
        <CustomInput
          classNames={{
            input: cn(s.input, { [s.passwordError]: error }),
            title: cn({ [s.errorTitle]: error }),
          }}
          type={isPassword ? (isShownPassword ? 'text' : 'password') : 'text'}
          onChange={handleChange}
          name={name}
          placeholder={title}
          label={title}
        />
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

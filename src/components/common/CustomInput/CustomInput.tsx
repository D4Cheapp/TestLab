import React, { ChangeEvent, FocusEventHandler } from 'react';
import cn from 'classnames';
import s from './CustomInput.module.scss';

interface Props {
  name: string;
  placeholder: string;
  label?: string;
  readonly?: boolean;
  type?: 'text' | 'password' | 'number';
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: FocusEventHandler;
  id?: string;
  defaultValue?: string;
  classNames?: {
    input?: string;
    title?: string;
  };
}

function CustomInput({
  name,
  placeholder,
  label,
  readonly = false,
  type = 'text',
  onChange,
  onBlur,
  defaultValue,
  id,
  classNames,
}: Props): React.ReactNode {
  return (
    <div className={s.root}>
      <input
        className={cn(s.input, classNames ? classNames.input : '')}
        type={type}
        name={name}
        id={id ? id : name}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readonly}
        defaultValue={defaultValue}
      />
      {label && (
        <label className={cn(s.label, classNames ? classNames.title : '')} htmlFor={id ? id : name}>
          {label}
        </label>
      )}
    </div>
  );
}

export default CustomInput;

import React, { ChangeEvent, FocusEventHandler } from 'react';
import cn from 'classnames';
import { Field } from 'formik';
import s from './CustomInput.module.scss';

interface Props {
  name: string;
  placeholder: string;
  isFormInput?: boolean;
  label?: string;
  readOnly?: boolean;
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
  isFormInput,
  label,
  readOnly,
  type = 'text',
  onChange,
  onBlur,
  defaultValue,
  id,
  classNames,
}: Props): React.ReactNode {
  const inputInfo = {
    className: cn(s.input, classNames ? classNames.input : ''),
    type,
    id: id ? id : name,
    name,
    placeholder,
    onBlur,
    readOnly,
  };
  return (
    <div className={s.root}>
      {isFormInput ? (
        <Field {...inputInfo} />
      ) : (
        <input {...inputInfo} onChange={onChange} defaultValue={defaultValue} />
      )}
      {label && (
        <label className={cn(s.label, classNames ? classNames.title : '')} htmlFor={id ? id : name}>
          {label}
        </label>
      )}
    </div>
  );
}

export default CustomInput;

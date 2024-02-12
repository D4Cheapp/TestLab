import React from 'react';
import cn from 'classnames';
import s from './CustomInputButton.module.scss';

interface Props {
  name: string;
  type: 'checkbox' | 'radio';
  width: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  defaultChecked?: boolean;
}

function CustomInputButton({ name, type, width, onChange, id, defaultChecked }: Props): React.ReactNode {
  return (
    <>
      <input
        className={cn({ [s.checkbox]: type === 'checkbox', [s.radioButton]: type === 'radio' })}
        type={type}
        name={name}
        id={id ? id : name}
        onChange={onChange}
        defaultChecked={defaultChecked}
      />
      <div
        className={cn({
          [s.customCheckbox]: type === 'checkbox',
          [s.customRadioButton]: type === 'radio',
        })}
        style={{ height: width, width }}
      />
    </>
  );
}

export default CustomInputButton;

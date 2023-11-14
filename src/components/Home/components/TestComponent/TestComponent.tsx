import React from 'react';
import clsx from 'clsx';
import styles from './TestComponent.module.scss';

interface TestComponentInterface {
  title: string;
}

function TestComponent({ title }: TestComponentInterface): React.ReactNode {
  return (
    <div className={styles.test}>
      <p className={styles.testTitle}>{title}</p>

      <div className={styles.buttonsContainer}>
        <button className={clsx(styles.testButton, styles.passTestButton)} />
        <button className={clsx(styles.testButton, styles.editTestButton)} />
        <button className={clsx(styles.testButton, styles.deleteTestButton)} />
      </div>
    </div>
  );
}

export default TestComponent;

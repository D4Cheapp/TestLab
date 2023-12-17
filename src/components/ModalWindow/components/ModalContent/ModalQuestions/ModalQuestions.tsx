import React, { useContext } from 'react';
import clsx from 'clsx';
import { ModalWindowContext } from '@/src/components/ModalWindow/ModalWindowContext';
import { CheckboxModalAnswer } from './CheckboxModalAnswer';
import styles from './ModalQuestions.module.scss';

interface ModalQuestionsInterface {
  questionType: 'single' | 'multiple' | 'number';
}

function ModalQuestions({ questionType }: ModalQuestionsInterface): React.ReactNode {
  const { numberAnswer, title, answers, clickEvents, refs } =
    useContext(ModalWindowContext);
  return (
    <>
      <div className={styles.questionAddTitle}>
        <input
          className={clsx(styles.questionInput, styles.input)}
          ref={refs.questionTitleRef}
          type="text"
          placeholder="Введите вопрос"
          name="questionTitle"
          defaultValue={title}
        />
        <label className={styles.inputTitle} htmlFor="questionTitle">
          Вопрос
        </label>
      </div>

      {(questionType === 'single' || questionType === 'multiple') && (
        <div className={styles.addAnswer}>
          <input
            className={clsx(styles.answerAddInput, styles.input)}
            type="text"
            placeholder="Введите вариант ответа"
            ref={refs.answerInputRef}
            name="answerVariant"
          />
          <label className={styles.inputTitle} htmlFor="answerVariant">
            Вариант ответа
          </label>
          <button
            className={styles.answerAddButton}
            type="button"
            onClick={clickEvents.onAddAnswerClick}
          >
            +
          </button>
        </div>
      )}

      <div
        className={clsx(styles.answersContainer, {
          [styles.severalScroll]: questionType !== 'number',
        })}
      >
        {((questionType === 'single' || questionType === 'multiple') &&
          answers
            .sort((a, b) => (a.dragInfo.order > b.dragInfo.order ? 1 : -1))
            .map((answer, index) => (
              <CheckboxModalAnswer key={index} index={index} answer={answer} />
            ))) ||
          (questionType === 'number' && (
            <div className={styles.numberAnswerContainer}>
              <input
                className={styles.answerNumber}
                ref={refs.numberAnswerRef}
                type="number"
                name="numberAnswer"
                placeholder="Введите ответ на вопрос"
                defaultValue={numberAnswer}
              />
              <label className={styles.inputTitle} htmlFor="numberAnswer">
                Ответ
              </label>
            </div>
          ))}
      </div>
    </>
  );
}

export default ModalQuestions;

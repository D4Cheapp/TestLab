import * as Yup from 'yup';
import { TestFormType } from '@/src/types/formTypes';

export const testFormInitialValues = {
  answerVariant: '',
  numberAnswer: '',
  questionTitle: '',
  questionType: 'single',
  testTitle: '',
} as TestFormType;

export const testFormValidation = Yup.object({
  answerVariant: Yup.string(),
  numberAnswer: Yup.number(),
  questionTitle: Yup.string(),
  questionType: Yup.string().oneOf(['single', 'number', 'multiple']),
  testTitle: Yup.string().required('Error: Test title should not be empty'),
});

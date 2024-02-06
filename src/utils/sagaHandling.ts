import { call, put } from 'redux-saga/effects';
import { createFetch } from '@/src/utils/createFetch';
import { setErrorsState, setLoadingState } from '@/src/reduxjs/base';

type SagaHandlingPropsType<T> = {
  href: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: object;
  action?: (data?: T) => void;
  isDataInAction?: boolean;
};

const createErrorsString = (response: { error: string }): string => {
  return Object.entries(response).map(([key, value]): string => {
    const errorType: string = (key.charAt(0).toUpperCase() + key.slice(1)).replace(
      '_',
      ' ',
    );
    return `${errorType}: ${value}`;
  })[0];
};

function* sagaHandling<T>({
  href,
  method,
  body,
  action,
  isDataInAction,
}: SagaHandlingPropsType<T>) {
  yield put(setLoadingState(true));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const response: [T | { error: string }, Response] | Error = yield call(() =>
    createFetch<T>({
      method,
      href,
      body: body ?? undefined,
    }),
  );

  const isActionExist = action !== undefined;
  const isResponseCrashed = response instanceof Error;
  const isResponseOkCrashed = !isResponseCrashed && !response[1].ok;
  const isResponseContainsErrorMessage =
    // @ts-ignore
    isResponseOkCrashed && 'error' in response[0];

  if (isResponseCrashed) {
    yield put(setErrorsState(response.message));
  }

  if (isResponseOkCrashed) {
    if (isResponseContainsErrorMessage) {
      //@ts-ignore
      const errors = createErrorsString(response[0]);
      yield put(setErrorsState(errors));
    } else {
      yield put(setErrorsState(`Error: ${response[1].statusText}`));
    }
  }

  if (isActionExist) {
    if (isDataInAction) {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      yield action(response[0]);
    } else {
      yield action();
    }
  }

  yield put(setLoadingState(false));
  return !isResponseCrashed && !isResponseContainsErrorMessage
    ? response[0]
    : { error: true };
}

export { sagaHandling };

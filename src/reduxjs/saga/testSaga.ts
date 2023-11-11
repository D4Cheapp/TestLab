import { all, PutEffectDescriptor, SimpleEffect, CallEffectDescriptor } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

type sagaGeneratorType<T> = Generator<
  | SimpleEffect<'PUT', PutEffectDescriptor<PayloadAction<boolean, 'testSlice/setLoadingState'>>>
  | Generator<
      | SimpleEffect<
          'PUT',
          PutEffectDescriptor<PayloadAction<string | undefined, 'testSlice/setErrorsState'>>
        >
      | void
      | SimpleEffect<
          'PUT',
          PutEffectDescriptor<PayloadAction<boolean, 'testSlice/setLoadingState'>>
        >,
      void,
      unknown
    >
  | SimpleEffect<'CALL', CallEffectDescriptor<[object, Response] | Error>>,
  void,
  [T, Response]
>;

export default function* testSaga() {
  yield all([]);
}
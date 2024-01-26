import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatchType, RootStateType } from '@/src/types/reduxTypes';

export const useAppDispatch: () => AppDispatchType = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;

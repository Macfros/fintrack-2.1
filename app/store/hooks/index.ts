"use client"

// hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// Custom hook for dispatch
export const useAppDispatch: () => AppDispatch = useDispatch;

// Custom hook for selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

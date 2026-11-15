import {useContext} from 'react';
import {hydration} from './hydration';

export const useHydrated = (): boolean => useContext(hydration.Taken);

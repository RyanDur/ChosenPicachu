import {createContext} from 'react';

export type OpeningFragment = {readonly openingReached: boolean; readonly onOpeningReached: () => void};

const noProviderMounted: OpeningFragment = {openingReached: false, onOpeningReached: () => undefined};

export const openingFragment = createContext<OpeningFragment>(noProviderMounted);

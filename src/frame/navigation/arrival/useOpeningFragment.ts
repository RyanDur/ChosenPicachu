import {useContext} from 'react';
import {OpeningFragment, openingFragment} from './openingFragment';

export const useOpeningFragment = (): OpeningFragment => useContext(openingFragment);

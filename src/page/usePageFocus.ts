import {useContext} from 'react';
import {PageFocus} from './PageFocus';

export const usePageFocus = (): (() => boolean) => useContext(PageFocus);

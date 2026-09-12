import {Paths} from '@pages/Paths';
import '@pages/Demos';

export const demosAt = (search = ''): string => `${Paths.demos}${search}`;

export const chartPageAt = (kind: string): string => `${Paths.demos}charts/${kind}/`;

import {Paths} from './Paths';

export const repository = {
  file: (path: string): string => `${Paths.repo}/blob/main/${path}`,
  directory: (path: string): string => `${Paths.repo}/tree/main/${path}`
};

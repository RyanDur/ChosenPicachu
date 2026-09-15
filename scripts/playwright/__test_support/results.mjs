import {has} from '@ryandur/sand';

export const outcome = (projectName, status, message) =>
  ({projectName, status, results: [{status, error: has(message) ? {message} : undefined}]});

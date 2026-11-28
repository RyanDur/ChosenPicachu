import {has, not} from '@ryandur/sand';

const roots = ['src', 'lib'];

const shortName = (path: string): string => {
  const [file, folder, parent] = path.split('/').reverse();
  const insideAComponent = /^[a-z]/.test(folder) && has(parent) && not(roots.includes(parent));
  return (insideAComponent ? [parent, folder, file] : [folder, file]).join('/');
};

export const fileNames = {
  of: (path: string, owner?: string): string => has(owner) ? `${owner}’s ${shortName(path)}` : shortName(path)
};

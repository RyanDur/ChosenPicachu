import {createContext} from 'react';

const unnamed = 'this page';

export const pageNaming = {
  unnamed,
  Name: createContext(unnamed),
  Namer: createContext<(name: string) => void>(() => undefined)
};

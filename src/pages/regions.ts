import {ComponentType, PropsWithChildren} from 'react';

export type Regions = {
  header: ComponentType;
  aside?: ComponentType;
  footer?: ComponentType;
  provider?: ComponentType<PropsWithChildren>;
  mainClassName?: string;
};

const regionNames = ['header', 'aside', 'footer', 'provider', 'mainClassName'];

export const isRegions = (handle: unknown): handle is Partial<Regions> =>
  typeof handle === 'object' && !!handle && regionNames.some(name => name in handle);

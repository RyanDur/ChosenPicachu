import {ComponentType, PropsWithChildren} from 'react';

export type Regions = {
  header: ComponentType;
  aside?: ComponentType;
  footer?: ComponentType;
  provider?: ComponentType<PropsWithChildren>;
  mainClassName?: string;
};

export const isRegions = (handle: unknown): handle is Regions =>
  typeof handle === 'object' && handle !== null && 'header' in handle;

import {createSearchParams} from 'react-router';
import {Paths} from '@pages/Paths';

export type Mode = 'adding' | 'viewing' | 'editing';

const modes: Readonly<Record<string, Mode>> = {view: 'viewing', edit: 'editing'};

export const modeOf = (param?: string): Mode => modes[param ?? ''] ?? 'adding';

export const userAt = (id: string, mode: 'view' | 'edit'): string =>
  `${Paths.users}?${createSearchParams({id, mode})}`;

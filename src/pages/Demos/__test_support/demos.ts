import {Paths} from '@frame/navigation';
import '@pages/Demos/DemosPage';
import '@pages/Demos/Charts/ChartPage';

export const demosAt = (topic: string, search = ''): string => `${Paths.demos}${topic}/${search}`;

export const chartPageAt = (kind: string, search = ''): string => `${Paths.demos}charts/${kind}/${search}`;

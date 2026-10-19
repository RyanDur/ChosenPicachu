import {Paths} from '@pages/Paths';
import {Concern, concernId} from '@pages/Record/moments/concerns';

export const storyAddress = (concern: Concern): string => `${Paths.record}#${concernId(concern)}`;

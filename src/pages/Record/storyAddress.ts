import {Paths} from '@frame/navigation';
import {Concern, concernId} from '@pages/Record/moments/concerns';

export const storyAddress = (concern: Concern): string => `${Paths.record}#${concernId(concern)}`;

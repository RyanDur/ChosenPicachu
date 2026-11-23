import {PartsGroup} from './parts-listed';
import {tabParts} from './tab-parts';
import {useShownTopic} from './useShownTopic';

export const useListedParts = (): readonly PartsGroup[] => tabParts[useShownTopic()];

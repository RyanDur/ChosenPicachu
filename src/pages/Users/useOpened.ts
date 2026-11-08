import * as schema from 'schemawax';
import {useSearchParamsObject} from '@frame/navigation/search-params';
import {Opened, openings} from './openings';
import {usersSelectors} from './usersSelectors';
import {useUsersSelector} from './useUsersSelector';

const address = {id: schema.string, mode: openings.modeInAddress};

export const useOpened = (): Opened => {
  const {id, mode} = useSearchParamsObject(address);
  return openings.of(useUsersSelector(usersSelectors.withId(id)), mode);
};

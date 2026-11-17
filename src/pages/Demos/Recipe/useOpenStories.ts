import {useContext} from 'react';
import {useNavigate} from 'react-router';
import {useSearchParamsOnceHydrated} from '@navigation/search-params';
import {not} from '@ryandur/sand';
import {currentLocation, scrollPlace} from '@navigation';
import {storyKeys} from './storyKeys';

type OpenStories = {
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
  setOpen: (id: string, open: boolean) => void;
};

export const useOpenStories = (param: string): OpenStories => {
  const [shown] = useSearchParamsOnceHydrated();
  const readLocation = useContext(currentLocation.Read);
  const navigate = useNavigate();
  const isOpen: OpenStories['isOpen'] = id => storyKeys.openIn(shown, param).has(id);
  const setOpen: OpenStories['setOpen'] = (id, open) => {
    const location = readLocation();
    const address = new URLSearchParams(location.search);
    if (storyKeys.openIn(address, param).has(id) === open) return;
    void navigate({search: `?${storyKeys.toggledIn(address, {param, id})}`, hash: location.hash},
      {replace: true, preventScrollReset: true, state: scrollPlace.keptFrom(location)});
  };
  const openNow = (id: string): boolean => storyKeys.openIn(new URLSearchParams(readLocation().search), param).has(id);
  return {isOpen, toggle: id => setOpen(id, not(openNow(id))), setOpen};
};

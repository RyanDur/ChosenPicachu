import {useLocation, useNavigate} from 'react-router';
import {useSearchParamsOnceHydrated} from '@navigation/search-params';
import {scrollPlace} from '@navigation';
import {storyKeys} from './storyKeys';

type OpenStories = {
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
  setOpen: (id: string, open: boolean) => void;
};

export const useOpenStories = (param: string): OpenStories => {
  const [shown, setSearchParams] = useSearchParamsOnceHydrated();
  const location = useLocation();
  const navigate = useNavigate();
  return {
    isOpen: id => storyKeys.openIn(shown, param).has(id),
    toggle: id => setSearchParams(previous => storyKeys.toggledIn(previous, {param, id}),
      {replace: true, preventScrollReset: true}),
    setOpen: (id, open) => {
      const address = new URLSearchParams(location.search);
      if (storyKeys.openIn(address, param).has(id) === open) return;
      void navigate({search: `?${storyKeys.toggledIn(address, {param, id})}`, hash: location.hash},
        {replace: true, preventScrollReset: true, state: scrollPlace.keptFrom(location)});
    }
  };
};

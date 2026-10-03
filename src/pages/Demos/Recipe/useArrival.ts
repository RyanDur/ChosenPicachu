import {useEffect} from 'react';
import {useLocation} from 'react-router';

export const useArrival = () => {
  const {hash} = useLocation();
  useEffect(() => {
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);
};

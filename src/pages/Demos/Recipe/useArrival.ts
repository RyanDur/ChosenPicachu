import {useEffect} from 'react';

export const useArrival = () => useEffect(() => {
  document.getElementById(location.hash.slice(1))?.scrollIntoView();
}, []);

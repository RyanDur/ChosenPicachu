import {FC, PropsWithChildren} from 'react';
import {Location, ScrollRestoration} from 'react-router';
import {BannerProvider, Banners} from '@banners';
import {FeedbackProvider} from '@feedback';
import {PageNameProvider} from '@page-name';
import {useArrivalDrawn} from '@navigation/arrival';
import {PageUnknown} from './PageUnknown';
import {Rail} from './Rail';

// the router keys every entry opened by its address 'default', so those entries would all share one scroll place
const placeOf = ({key, pathname, search}: Location): string => key === 'default' ? pathname + search : key;

export const Frame: FC<PropsWithChildren<{pageUnknown?: boolean}>> = ({children, pageUnknown = false}) => {
  useArrivalDrawn();
  return <BannerProvider><PageNameProvider><FeedbackProvider><PageUnknown.Provider value={pageUnknown}>
    <Rail/>
    {children}
    <Banners/>
    <ScrollRestoration getKey={placeOf}/>
  </PageUnknown.Provider></FeedbackProvider></PageNameProvider></BannerProvider>;
};

import {FC, PropsWithChildren} from 'react';
import {ScrollRestoration} from 'react-router';
import {BannerProvider, Banners} from '@banners';
import {FeedbackProvider} from '@feedback';
import {PageNameProvider} from '@page-name';
import {useArrivalDrawn} from '@navigation/arrival';
import {scrollPlace} from '@navigation';
import {PageUnknown} from './PageUnknown';
import {Rail} from './Rail';

export const Frame: FC<PropsWithChildren<{pageUnknown?: boolean}>> = ({children, pageUnknown = false}) => {
  useArrivalDrawn();
  return <BannerProvider><PageNameProvider><FeedbackProvider><PageUnknown.Provider value={pageUnknown}>
    <Rail/>
    {children}
    <Banners/>
    <ScrollRestoration getKey={scrollPlace.of}/>
  </PageUnknown.Provider></FeedbackProvider></PageNameProvider></BannerProvider>;
};

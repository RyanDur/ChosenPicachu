import {FC} from 'react';
import {Codes, Says, Snippet, Step, Steps, Story, Words, Tell, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import providerSource from '@components/Banners/BannerProvider.tsx?raw';
import raisingSource from '@components/Banners/raising.ts?raw';
import useBannersSource from '@components/Banners/useBanners.ts?raw';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

export const RaisingRecipe: FC = () =>
  <Story param="news" id="raise"
         can="Any component can raise its trouble"
         soThat="the news has one home and the raisers stay small">
    <Tell>We could thread an onError prop through every component that might fail, but
      then the whole tree carries plumbing it never uses; so the raising lives in a
      context, any component asks useBanners for raise, and a component rendered without
      a provider raises into a quiet default that neither crashes nor speaks.</Tell>
    <Steps>
      <Step title="Name the contract">
        <Words want="Before anything can raise, the page needs one word for what raising is.">
          <Says>Raising is the whole contract: the standing news, raise, and lower. The
            default is quietly, whose raise does nothing, so a component outside a
            provider degrades in silence instead of throwing; absence of a provider is
            a configuration, not an error.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...span(raisingSource, 'export type Raising = {', '};'), gap,
            ...unit(raisingSource, 'export const quietly'), gap,
            ...unit(raisingSource, 'export const Raised')
          ]}/>
        </Codes>
      </Step>
      <Step title="Keep the list">
        <Words want="The provider owns the standing news; everyone else only speaks to it.">
          <Says>raise appends a message with a fresh id, lower filters one out. Both sit
            in useCallback so their identity holds still: an effect that lists raise as
            a dependency must not reconnect its socket every time the news changes.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" foil lines={[
            plain('<Chart onError={onError}/>'),
            plain('<Table onError={onError}/>'),
            plain('<Gallery onError={onError}/>'),
            aside('// every branch of the tree now carries a prop most of it never reads')
          ]}/>
          <Snippet label="JS" lines={[
            ...unit(providerSource, 'const raise = useCallback('), gap,
            ...unit(providerSource, 'const lower = useCallback(')
          ]}/>
        </Codes>
      </Step>
      <Step title="Ask for it">
        <Words want="A component that might fail should say one word to get help, not learn an architecture.">
          <Says>useBanners is the whole surface. Whatever provider stands above you
            answers; if none does, quietly answers instead.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(useBannersSource, 'export const useBanners')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

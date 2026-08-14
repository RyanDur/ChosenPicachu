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
         can="Any component can raise a banner"
         soThat="the news has one home">
    <Tell>We could pass a callback down to every component that might have something to
      say, but then the whole tree carries plumbing; so the raising lives in a context.
      A component asks useBanners for raise, and one rendered without a provider raises
      into a quiet default that neither crashes nor speaks.</Tell>
    <Steps>
      <Step title="Name the contract">
        <Words want="One word for what raising is, and one word to ask for it.">
          <Says>Raising is the whole contract: the standing news, raise, and lower.
            useBanners is the whole surface. The default is quietly, whose raise does
            nothing, so a missing provider is a configuration, not an error.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" foil lines={[
            plain('<Chart onNews={onNews}/>'),
            plain('<Table onNews={onNews}/>'),
            plain('<Gallery onNews={onNews}/>'),
            aside('// every branch of the tree now carries a prop most of it never reads')
          ]}/>
          <Snippet label="JS" lines={[
            ...span(raisingSource, 'export type Raising = {', '};'), gap,
            ...unit(raisingSource, 'export const quietly'), gap,
            ...unit(useBannersSource, 'export const useBanners')
          ]}/>
        </Codes>
      </Step>
      <Step title="Keep the list">
        <Words want="The provider owns the standing news; everyone else only speaks to it.">
          <Says>raise appends a message with a fresh id, lower filters one out. Both sit
            in useCallback so their identity holds still and an effect can depend on
            raise without rerunning every time the news changes.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(providerSource, 'const raise = useCallback('), gap,
            ...unit(providerSource, 'const lower = useCallback(')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

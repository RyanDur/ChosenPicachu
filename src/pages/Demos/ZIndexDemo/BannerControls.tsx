import {FC} from 'react';
import {not} from '@ryandur/sand';
import {useHydrated} from '@components';
import {decked, news} from '@components/fibs';
import {Align, bannerChange, Entrance, Side, Stack, useBannerDispatch} from '@banners';
import {
  AlignDial, DialGroup, DialRow, EntranceDial, Reading, SideDial, StackDial, useControls
} from '../Controls';
import {Exhibit, ExhibitFoot} from '../Exhibit';

type Copy = {
  side: Record<Side, string>;
  align: Record<Align, string>;
  enter: Record<Entrance, string>;
  stack: Record<Stack, string>;
};

const copy: Copy = {
  side: {
    top: 'The panel holds to the window’s top edge.',
    middle: 'The panel sits in the window’s middle.',
    bottom: 'The panel holds to the window’s bottom edge.'
  },
  align: {
    left: 'The panel holds to the window’s left edge.',
    center: 'The browser centers the panel across the window.',
    right: 'The panel holds to the window’s right edge.'
  },
  enter: {
    above: 'A new banner slides in from above the window’s top edge.',
    below: 'A new banner slides in from below the window’s bottom edge.',
    left: 'A new banner slides in from past the window’s left edge.',
    right: 'A new banner slides in from past the window’s right edge.'
  },
  stack: {
    down: 'Each new banner goes below the ones already up.',
    up: 'Each new banner goes above the ones already up.',
    left: 'The stack grows leftward, with the newest banner at the left.',
    right: 'The stack grows rightward, with the newest banner at the right.'
  }
};

const nextNews = decked(news);

export const BannerControls: FC = () => {
  const hydrated = useHydrated();
  const {side, align, enter, stack} = useControls();
  const dispatchBanner = useBannerDispatch();
  return <Exhibit name="The banner, at the window’s edge">
    <DialGroup>
      <DialRow label="side">
        <SideDial name="banner-side"/>
        <Reading>{copy.side[side]}</Reading>
      </DialRow>
      <DialRow label="align">
        <AlignDial name="banner-align"/>
        <Reading>{copy.align[align]}</Reading>
      </DialRow>
      <DialRow label="entrance">
        <EntranceDial name="banner-entrance"/>
        <Reading>
          <span className="when-motion-allowed">{copy.enter[enter]}</span> <span className="when-less-motion">If your system asks for less motion, a new banner appears in place,
            whichever entrance you choose.</span>
        </Reading>
      </DialRow>
      <DialRow label="stack">
        <StackDial name="banner-stack"/>
        <Reading>{copy.stack[stack]}</Reading>
      </DialRow>
    </DialGroup>
    <p className="caption">
      <code className="monospaced broken-anywhere">{`?side=${side}&align=${align}&enter=${enter}&stack=${stack}`}</code>
    </p>
    <button type="button" tabIndex={0} className="button primary reachable"
      disabled={not(hydrated)} onClick={() => dispatchBanner(bannerChange.raised(nextNews()))}>
      Raise a banner
    </button>
    <ExhibitFoot lead="The banner, at the window’s edge.">Four settings: which side the banner lands on, how it lines up
      there, where it comes from, and where a new banner goes.</ExhibitFoot>
  </Exhibit>;
};

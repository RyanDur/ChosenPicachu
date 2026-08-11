import {FC} from 'react';
import {Codes, Mdn, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, aside, plain} from '../Recipe';
import {span, unit} from '../Recipe/carve';
import bannersSource from '@components/Banners/Banners.tsx?raw';
import providerSource from '@components/Banners/BannerProvider.tsx?raw';
import raisingSource from '@components/Banners/raising.ts?raw';
import useBannersSource from '@components/Banners/useBanners.ts?raw';
import bannersCss from '@components/Banners/Banners.css?raw';
import liveTradesSource from '../Charts/useLiveTrades.ts?raw';
import candlesHookSource from '../Charts/usePeriodCandles.ts?raw';
import troubleSource from '@transport/trouble.ts?raw';
import '../Recipe/Recipe.css';

const gap = plain(' ');

const topStory =
  <Story param="news" id="top"
         can="The user sees trouble above everything"
         soThat="no stacking context can bury the news">
    <Tell>We could give the banner a huge z-index, but z-index only ranks siblings inside
      one stacking context, and any ancestor with a transform, a filter, or a z-index of
      its own starts a new one; your 9999 is local the moment that happens. So the panel
      is a <Mdn path="Web/API/Popover_API">popover</Mdn>, and the platform lifts it to
      the <Mdn path="Glossary/Top_layer">top layer</Mdn>, a place the cascade of stacking
      contexts cannot reach.</Tell>
    <Steps>
      <Step title="Claim the top layer">
        <Words want="A bigger number cannot win an argument with a stacking context. The news needs a layer that sits above all of them.">
          <Says>The panel is a section with popover set to manual: manual keeps light
            dismiss out of it, so the news does not vanish on a stray click. Its role
            is <Mdn path="Web/Accessibility/ARIA/Reference/Roles/alert_role">alert</Mdn>,
            so a screen reader announces what arrives without being asked to look.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" foil lines={[
            plain('.banners {'),
            plain('  position: fixed;'),
            plain('  z-index: 9999;'),
            plain('}'),
            aside('/* an ancestor with a transform starts a new stacking context; 9999 is now local */')
          ]}/>
          <Snippet label="JS" lines={[
            ...span(bannersSource, 'return <section', '</section>;')
          ]}/>
        </Codes>
      </Step>
      <Step title="Show it when there is news">
        <Words want="The top layer is not a place you sit; it is a place you enter. The panel should rise when trouble arrives and leave when the last of it is dismissed.">
          <Says>An effect watches the count. showPopover lifts the panel when the first
            trouble arrives, hidePopover returns it when the wall is clear, and
            matches(':popover-open') keeps both calls honest so neither runs twice.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(bannersSource, 'useEffect(() => {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Dress the trouble">
        <Words want="A banner is read at a glance, in the corner of an eye already busy with something else.">
          <Says>Each trouble is a card in the house style, and the dismiss button gives
            the whole target height so a hurried pointer still lands.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" lines={[
            ...unit(bannersCss, '.trouble {'), gap,
            ...unit(bannersCss, '.dismiss {')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

const raiseStory =
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

const onceStory =
  <Story param="news" id="once"
         can="The same trouble stands only once"
         soThat="a flapping feed cannot shout the page down">
    <Tell>A fetch that fails, retries, and fails again would say the same sentence three
      times; so raise checks the standing news first. A message already on the wall stays
      one banner, and only a dismissal clears the way for it to stand fresh.</Tell>
    <Steps>
      <Step title="Refuse the duplicate">
        <Words want="Repetition is not emphasis. The second copy of the same news adds noise, not information.">
          <Says>raise looks for its message among the standing banners and appends only
            when it is new. Dismiss a banner and the same trouble may stand again; the
            wall remembers what stands, not what stood.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" foil lines={[
            plain('const raise = (message) =>'),
            plain('  setBanners(standing => [...standing, {message}]);'),
            aside('// three failed retries, three identical banners')
          ]}/>
          <Snippet label="JS" lines={[
            ...unit(providerSource, 'const raise = useCallback(')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

const wiredStory =
  <Story param="news" id="wired"
         can="The feeds raise their own news"
         soThat="failure never passes in silence">
    <Tell>The socket and the history fetch both end in an error this site used to throw
      away; so each failure now maps to a sentence a person can read, and the handler
      raises it beside the fallback state it already set. The chart still shows what it
      can; the banner says why it cannot show more.</Tell>
    <Steps>
      <Step title="The stream tells you">
        <Words want="A live feed can refuse the handshake or hang up mid-stream. Either way the user deserves the sentence, not the silence.">
          <Says>The streaming call maps its failure to words at the door, onFailure
            raises whatever arrives, and onClose raises its own sentence when the far
            end hangs up. The status pill still turns; the banner is the news of the
            turning.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" foil lines={[
            plain('const stream = streaming(url, () => undefined);'),
            aside('// the failure happened; nobody heard it')
          ]}/>
          <Snippet label="JS" lines={[
            ...unit(liveTradesSource, 'const stream = streaming(')
          ]}/>
        </Codes>
      </Step>
      <Step title="The fetch tells you">
        <Words want="An HTTP failure arrives with a flavor: unreachable, refused, broken. The sentence should keep it.">
          <Says>troubleWith joins a subject to a phrase keyed by the HTTPError, so the
            museum can be having trouble while the candle history could not be reached,
            and every raiser spends one line to say so.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(troubleSource, 'const phrases'), gap,
            ...unit(troubleSource, 'export const troubleWith'), gap,
            ...unit(candlesHookSource, 'const fetching = periodCandles(')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

export const TopLayerTutorial: FC = () =>
  <section className="tutorials">
    <h2 className="tutorials-title">let’s build this feature</h2>
    <p className="overview">
      We are going to build this site’s banner system, the place trouble goes to be seen.
      Here is how to use this page: every card below is a feature, told as a <a
        className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a>. Open a card and you get the plan for that feature
      and the steps that build it, with the real code from this site, so what you read is
      what runs. The cards at the top of this page fight for the front with z-index; the
      button under them raises a banner that does not fight at all. The dashed code is the
      wrong way you would probably try first, and the links go to MDN if you want more.
    </p>
    <figure className="feedback">
      <blockquote className="quote">
        When something breaks, tell me. Do not make me guess why the chart went quiet,
        and do not hide the note under the thing that broke.
      </blockquote>
      <figcaption className="attribution">a user</figcaption>
    </figure>
    <Stories>
      {topStory}
      {raiseStory}
      {onceStory}
      {wiredStory}
    </Stories>
  </section>;

import {FC} from 'react';
import {Codes, Says, Snippet, Step, Steps, Story, Words, Tell, aside, plain} from '../../Recipe';
import {unit} from '../../Recipe/carve';
import liveTradesSource from '../../Charts/useLiveTrades.ts?raw';
import candlesHookSource from '../../Charts/usePeriodCandles.ts?raw';
import troubleSource from '@transport/trouble.ts?raw';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

export const WiredRecipe: FC = () =>
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

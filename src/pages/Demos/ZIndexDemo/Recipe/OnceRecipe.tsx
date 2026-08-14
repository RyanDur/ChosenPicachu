import {FC} from 'react';
import {Codes, Says, Snippet, Step, Steps, Story, Words, Tell, aside, plain} from '../../Recipe';
import {unit} from '../../Recipe/carve';
import providerSource from '@components/Banners/BannerProvider.tsx?raw';
import '../../Recipe/Recipe.css';

export const OnceRecipe: FC = () =>
  <Story param="news" id="once"
         can="The same message stands only once"
         soThat="repetition cannot shout the page down">
    <Tell>Raise the same sentence twice and the second copy adds noise, not information;
      so raise checks the standing news first. A message already on the wall stays one
      banner, and only a dismissal clears the way for it to stand fresh.</Tell>
    <Steps>
      <Step title="Refuse the duplicate">
        <Words want="The wall remembers what stands, not what stood.">
          <Says>raise looks for its message among the standing banners and appends only
            when it is new. Dismiss a banner and the same message may stand again.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" foil lines={[
            plain('const raise = (message) =>'),
            plain('  setBanners(standing => [...standing, {message}]);'),
            aside('// raised three times, standing three times')
          ]}/>
          <Snippet label="JS" lines={[
            ...unit(providerSource, 'const raise = useCallback(')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

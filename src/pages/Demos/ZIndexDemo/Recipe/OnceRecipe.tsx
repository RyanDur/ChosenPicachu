import {FC} from 'react';
import {Codes, Says, Snippet, Step, Steps, Story, Words, Tell, aside, plain} from '../../Recipe';
import {unit} from '../../Recipe/carve';
import providerSource from '@components/Banners/BannerProvider.tsx?raw';
import '../../Recipe/Recipe.css';

export const OnceRecipe: FC = () =>
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

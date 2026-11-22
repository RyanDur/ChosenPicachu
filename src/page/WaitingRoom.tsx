import {FC} from 'react';
import names from '@navigation/names.json';
import {Header} from './Header';
import {CenteredMain} from './CenteredMain';

export const WaitingRoom: FC = () =>
  <>
    <Header pageName="Chosen Picachu" listed={names.home}/>
    <CenteredMain>
      <noscript>
        <p className="paragraph prose">The script draws this page, and it is off. The pages the rail lists are here
          without it.</p>
      </noscript>
    </CenteredMain>
  </>;

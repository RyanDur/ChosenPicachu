import {FC} from 'react';
import names from '@navigation/names.json';
import {Header} from './Header';
import {Page} from './Page';

export const WaitingRoom: FC = () =>
  <Page header={<Header title="Chosen Picachu" listed={names.home}/>} inView={false}>
    <noscript>
      <p className="paragraph prose">The script draws this page, and it is off. The pages the rail lists are here
        without it.</p>
    </noscript>
  </Page>;

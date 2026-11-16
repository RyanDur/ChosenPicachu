import {FC} from 'react';
import {Picks} from '@pages/Demos/Tables';
import {useControls} from './useControls';

export const TrackDial: FC = () => {
  const {track, change} = useControls();
  return <Picks label="input track"
    scale="paragraph"
    choices={[
      {words: 'By pointer', value: 'pointer'},
      {words: 'By keyboard', value: 'keyboard'}
    ]}
    chosen={track}
    onPicked={next => change({track: next})}/>;
};

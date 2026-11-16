import {FC} from 'react';
import {Picks} from './Picks';
import {useControls} from './useControls';

export const TrackDial: FC = () => {
  const {track, change} = useControls();
  return <Picks label="input track"
    typeScale="paragraph"
    choices={[
      {words: 'By pointer', value: 'pointer'},
      {words: 'By keyboard', value: 'keyboard'}
    ]}
    chosen={track}
    onPicked={next => change({track: next})}/>;
};

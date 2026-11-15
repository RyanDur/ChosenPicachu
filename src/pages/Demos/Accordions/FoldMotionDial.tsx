import {FC} from 'react';
import {DialRow, FoldMotion, useControls} from '../Controls';

const foldMotions = [
  {words: 'Reveal', value: 'reveal'},
  {words: 'Drawer', value: 'drawer'},
  {words: 'Static', value: 'static'}
] as const;

const readings: Record<FoldMotion, string> = {
  reveal: 'The text is uncovered from its first line down.',
  drawer: 'The text slides down from under its bar.',
  static: 'The fold opens at once, with nothing moving.'
};

export const FoldMotionDial: FC = () => {
  const {foldMotion, change} = useControls();
  return <DialRow label="fold motion"
    name="fold-motion"
    choices={foldMotions}
    chosen={foldMotion}
    onChosen={next => change({foldMotion: next})}
    reading={<>
      <span className="when-motion-allowed">{readings[foldMotion]}</span>{' '}
      <span className="when-less-motion">If your system asks for less motion, every fold here opens at once,
        whichever you choose.</span>
    </>}/>;
};

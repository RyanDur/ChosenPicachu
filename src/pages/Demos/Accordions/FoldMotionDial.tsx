import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {DialRow, Reading, useControls} from '../Controls';
import {FoldMotion} from '../ReaderSettings';

const foldMotions = [
  {words: 'Reveal', value: 'reveal'},
  {words: 'Drawer', value: 'drawer'},
  {words: 'Static', value: 'static'}
] as const;

const motions: Record<FoldMotion, string> = {
  reveal: 'The text is uncovered from its first line down.',
  drawer: 'The text slides down from under its bar.',
  static: 'The fold opens at once, with nothing moving.'
};

const lessMotion = 'If your system asks for less motion, every fold here opens at once, whichever you choose.';

export const FoldMotionDial: FC = () => {
  const {foldMotion, change} = useControls();
  return <DialRow label="fold motion">
    <PillGlider label="fold motion"
      name="fold-motion"
      choices={foldMotions}
      chosen={foldMotion}
      onChosen={next => change({foldMotion: next})}/>
    <Reading>
      <span className="when-motion-allowed">{motions[foldMotion]}</span> <span className="when-less-motion">
        {lessMotion}</span>
    </Reading>
  </DialRow>;
};

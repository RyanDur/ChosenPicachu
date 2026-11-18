import {FC} from 'react';
import {DialRow, useControls} from '../Controls';
import {FoldMotion} from '../ReaderSettings';

const foldMotions = [
  {words: 'Reveal', value: 'reveal'},
  {words: 'Drawer', value: 'drawer'},
  {words: 'Static', value: 'static'}
] as const;

type Readings = {
  motions: Record<FoldMotion, string>;
  lessMotion: string;
};

const onThisPage: Readings = {
  motions: {
    reveal: 'The text is uncovered from its first line down.',
    drawer: 'The text slides down from under its bar.',
    static: 'The fold opens at once, with nothing moving.'
  },
  lessMotion: 'If your system asks for less motion, every fold here opens at once, whichever you choose.'
};

const onThePartPages: Readings = {
  motions: {
    reveal: 'On the part pages, the text is uncovered from its first line down.',
    drawer: 'On the part pages, the text slides down from under its bar.',
    static: 'On the part pages, the fold opens at once, with nothing moving.'
  },
  lessMotion: 'If your system asks for less motion, every fold on the part pages opens at once, whichever you choose.'
};

export const FoldMotionDial: FC<{forThePartPages?: boolean}> = ({forThePartPages = false}) => {
  const {foldMotion, change} = useControls();
  const {motions, lessMotion} = forThePartPages ? onThePartPages : onThisPage;
  return <DialRow label="fold motion"
    name="fold-motion"
    choices={foldMotions}
    chosen={foldMotion}
    onChosen={next => change({foldMotion: next})}
    reading={<>
      <span className="when-motion-allowed">{motions[foldMotion]}</span> <span
        className="when-less-motion">{lessMotion}</span>
    </>}/>;
};

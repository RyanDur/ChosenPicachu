import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {Controls, ControlsProps, Copy} from '../Controls';
import {World} from './params';

const cap = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1);

const copy: Copy = {
  kind: 'table',
  readout: (pace, origin, motion) => `<${cap(pace)}${cap(origin)}${cap(motion)}Table/>`,
  pace: {
    eager: 'Neighbours swap the moment you drag past them, so the order is already settled when you let go.',
    lazy: 'The table holds its shape while you drag and commits the new order on drop.'
  },
  origin: {
    keep: 'The lifted row or column stays where it was, so you can see the gap it will leave.',
    hide: 'The lifted row or column blanks out at its origin; only the ghost under your pointer reads as real.'
  },
  motion: {
    animated: 'The swap itself is instant; displaced cells slide to their new seats.',
    static: 'Reorders apply in a single frame; cells cut to their new seats.'
  }
};

const worldCopy: Record<World, string> = {
  react: 'React builds and rebuilds this table; the page you read is its render.',
  html: 'The table stands in its own document: markup, stylesheet, and script, no framework.'
};

type TableControlsProps = ControlsProps & {
  world: World;
  onWorld: (world: World) => void;
};

export const TableControls: FC<TableControlsProps> = ({world, onWorld, ...props}) =>
  <Controls copy={{...copy, readout: (pace, origin, motion) => world === 'html' ? '<TableFrame/>' : copy.readout(pace, origin, motion)}}
            {...props}>
    <article className="control">
      <span className="axis caption uppercase">world</span>
      <PillGlider label="world"
                  name="table-world"
                  options={[
                    {display: 'React', value: 'react'},
                    {display: 'HTML', value: 'html'}
                  ]}
                  chosen={world}
                  onChoose={onWorld}/>
      <p className="reading paragraph">{worldCopy[world]}</p>
    </article>
  </Controls>;

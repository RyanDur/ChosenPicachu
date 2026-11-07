import {FC} from 'react';
import {World} from '../params';
import {useWorld} from './useWorld';

const worldCopy: Record<World, string> = {
  react: 'React builds and rebuilds this table; the page you read is its render.',
  vanilla: 'The table stands in its own document: markup, style sheet, and script, no framework.'
};

export const WorldNote: FC = () => <p className="paragraph">{worldCopy[useWorld().world]}</p>;

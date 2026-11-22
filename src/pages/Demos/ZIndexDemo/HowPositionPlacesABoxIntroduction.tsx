import {FC} from 'react';
import {PartLink} from './PartLink';

export const HowPositionPlacesABoxIntroduction: FC = () =>
  <p className="paragraph">The pile needed one rule to make its cards overlap: position. This part goes through the
    five values position can take, what each does to a box and the boxes around it, and where we meet each one. This
    part assumes what <PartLink part="why-third-is-on-top"/> gives: the pile, and what a positioned box is.</p>;

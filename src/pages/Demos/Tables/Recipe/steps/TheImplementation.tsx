import {FC} from 'react';
import {repository} from '@navigation';
import {Tell} from '../../../Recipe';
import {useControls} from '../../../Controls';
import type {World} from '../../../Controls';

const sourceOf = (world: World, path: string): string => world === 'react'
  ? repository.directory(`src/pages/Demos/Tables/${path}`)
  : repository.file(`src/pages/Demos/Tables/${path}`);

export const TheImplementation: FC<{react: string; vanilla: string}> = ({react, vanilla}) => {
  const {world} = useControls();
  return <Tell>Every block below is carved from the source as it stands, so it cannot drift from the
    build. To read the whole thing in one place, here is <a className="signpost"
    href={sourceOf(world, world === 'react' ? react : vanilla)}
    target="_blank"
    rel="noreferrer">the implementation</a>.</Tell>;
};

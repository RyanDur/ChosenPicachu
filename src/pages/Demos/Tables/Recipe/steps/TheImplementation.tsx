import {FC} from 'react';
import {directoryInRepository, fileInRepository} from '@pages/Paths';
import {Tell} from '../../../Recipe';
import type {World} from '../../../Controls';

const sourceOf = (world: World, path: string): string =>
  (world === 'react' ? directoryInRepository : fileInRepository)(`src/pages/Demos/Tables/${path}`);

export const TheImplementation: FC<{world: World; react: string; vanilla: string}> = ({world, react, vanilla}) =>
  <Tell>Every block below is carved from the source as it stands, so it cannot drift from the
    build. To read the whole thing in one place, here is <a className="signpost"
    href={sourceOf(world, world === 'react' ? react : vanilla)}
    target="_blank"
    rel="noreferrer">the implementation</a>.</Tell>;

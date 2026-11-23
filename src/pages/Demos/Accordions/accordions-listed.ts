import {PartsGroup} from '../parts-listed';
import {BookPart, accordionParts} from './part-pages';

const entryOf = (heading: BookPart) => {
  const {to, heading: fragment, title, minutes, says} = accordionParts.listed(heading);
  return {to, heading: fragment, name: title, minutes, says};
};

export const accordionsListed: readonly PartsGroup[] = [
  {entries: [entryOf('html-alone-heading')]},
  {label: 'How we used to build a fold', entries: (['remembers-heading', 'max-height-guess-heading', 'measured-heading'] as const).map(entryOf)},
  {label: 'What the platform gives now', entries: (['platform-way-heading', 'motion-heading'] as const).map(entryOf)}
];

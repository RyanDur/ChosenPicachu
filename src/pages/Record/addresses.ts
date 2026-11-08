import {Paths} from '@navigation';
import {Concern, concerns, MomentKey, moments} from './moments';
import {concertParagraphs} from './concertParagraphs';

const ofMoment = (key: MomentKey): string => `${Paths.record}#${moments.headings[key].id}`;

const ofStory = (concern: Concern): string => `${Paths.record}#${concerns.idOf(concern)}`;

const styleInScript = `${Paths.record}#${concertParagraphs.styleInScript}`;

const customElements = `${Paths.record}#${concertParagraphs.customElements}`;

export const recordAddress = {ofMoment, ofStory, styleInScript, customElements};

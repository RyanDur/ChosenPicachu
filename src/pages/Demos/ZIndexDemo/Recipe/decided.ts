import {Entrance, Stack} from '@components/Banners/params';
import {Line} from '../../Recipe/Snippet';
import {plain} from '../../Recipe';

export const arriveDistance: Record<Entrance, string> = {
  above: '&.from-above { --arrive: 0 -100dvh; }',
  below: '&.from-below { --arrive: 0 100dvh; }',
  left: '&.from-left { --arrive: -100dvw 0; }',
  right: '&.from-right { --arrive: 100dvw 0; }'
};

export const slotTrack: Record<Stack, string> = {
  down: 'grid-template-rows: 1fr;',
  up: 'grid-template-rows: 1fr;',
  left: 'grid-template-columns: 1fr;',
  right: 'grid-template-columns: 1fr;'
};

export const closedSlot: Record<Stack, string> = {
  down: 'grid-template-rows: 0fr;',
  up: 'grid-template-rows: 0fr;',
  left: 'grid-template-columns: 0fr;',
  right: 'grid-template-columns: 0fr;'
};

export const closedGap: Record<Stack, string> = {
  down: 'margin-block-end: 0;',
  up: 'margin-block-end: 0;',
  left: 'margin-inline-end: 0;',
  right: 'margin-inline-end: 0;'
};

export const ownedGap: Record<Stack, string> = {
  down: '.trouble:not(:last-child) { margin-block-end: var(--base); }',
  up: '.trouble:not(:first-child) { margin-block-end: var(--base); }',
  right: '.trouble:not(:last-child) { margin-inline-end: var(--base); }',
  left: '.trouble:not(:first-child) { margin-inline-end: var(--base); }'
};

export const openingTransition: Record<Stack, string> = {
  down: 'grid-template-rows 0.3s,',
  up: 'grid-template-rows 0.3s,',
  left: 'grid-template-columns 0.3s,',
  right: 'grid-template-columns 0.3s,'
};

export const gapTransition: Record<Stack, string> = {
  down: 'margin-block-end 0.3s,',
  up: 'margin-block-end 0.3s,',
  left: 'margin-inline-end 0.3s;',
  right: 'margin-inline-end 0.3s;'
};

export const closingGapTransition: Record<Stack, string> = {
  down: 'margin-block-end 0.3s 0.6s;',
  up: 'margin-block-end 0.3s 0.6s;',
  left: 'margin-inline-end 0.3s 0.6s;',
  right: 'margin-inline-end 0.3s 0.6s;'
};

export const closingTransition: Record<Stack, string> = {
  down: 'grid-template-rows 0.3s 0.6s,',
  up: 'grid-template-rows 0.3s 0.6s,',
  left: 'grid-template-columns 0.3s 0.6s,',
  right: 'grid-template-columns 0.3s 0.6s,'
};

export const slotLines = (stack: Stack): Line[] => [
  plain('.trouble {'),
  plain('  display: grid;'),
  plain(`  ${slotTrack[stack]}`),
  plain('  transition:'),
  plain(`    ${openingTransition[stack]}`),
  plain(`    ${gapTransition[stack].replace(',', ';')}`),
  plain('  @starting-style {'),
  plain(`    ${closedSlot[stack]}`),
  plain(`    ${closedGap[stack]}`),
  plain('  }'),
  plain('}'),
  plain(' '),
  plain(ownedGap[stack])
];

export const arrivalLines = (enter: Entrance): Line[] => [
  plain(arriveDistance[enter]),
  plain(' '),
  plain('.trouble {'),
  plain('  transition: translate 0.6s cubic-bezier(0.45, 0, 0.15, 1) 0.3s;'),
  plain('  @starting-style {'),
  plain('    translate: var(--arrive);'),
  plain('  }'),
  plain('}')
];

export const leavingLines = (stack: Stack): Line[] => [
  plain('.trouble.leaving {'),
  plain(`  ${closedSlot[stack]}`),
  plain(`  ${closedGap[stack]}`),
  plain('  translate: var(--arrive);'),
  plain('  transition:'),
  plain('    translate 0.6s cubic-bezier(0.45, 0, 0.15, 1),'),
  plain(`    ${closingTransition[stack]}`),
  plain(`    ${closingGapTransition[stack]}`),
  plain('}')
];

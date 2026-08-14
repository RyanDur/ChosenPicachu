import {Align, Entrance, Side, Stack} from '@components/Banners/params';
import {Line} from '../../Recipe/Snippet';
import {plain} from '../../Recipe';

export const sideMargin: Record<Side, string> = {
  top: 'margin-block: var(--base-x-2) auto;',
  middle: 'margin-block: auto;',
  bottom: 'margin-block: auto var(--base-x-2);'
};

export const alignMargin: Record<Align, string> = {
  left: 'margin-inline: var(--base-x-2) auto;',
  center: 'margin-inline: auto;',
  right: 'margin-inline: auto var(--base-x-2);'
};

export const arriveFrom: Record<Entrance, string> = {
  above: 'translate: 0 -100dvh;',
  below: 'translate: 0 100dvh;',
  left: 'translate: -100dvw 0;',
  right: 'translate: 100dvw 0;'
};

export const slotTrack: Record<Stack, string> = {
  down: 'grid-template-rows: 1fr;',
  up: 'grid-template-rows: 1fr;',
  left: 'grid-template-columns: 1fr;',
  right: 'grid-template-columns: 1fr;'
};

export const slotOpening: Record<Stack, string> = {
  down: 'animation: open-slot 0.3s;',
  up: 'animation: open-slot 0.3s;',
  left: 'animation: open-column 0.3s;',
  right: 'animation: open-column 0.3s;'
};

export const ownedGap: Record<Stack, string> = {
  down: '.trouble:not(:last-child) { margin-block-end: var(--base); }',
  up: '.trouble:not(:first-child) { margin-block-end: var(--base); }',
  right: '.trouble:not(:last-child) { margin-inline-end: var(--base); }',
  left: '.trouble:not(:first-child) { margin-inline-end: var(--base); }'
};

export const closingSlot: Record<Stack, string> = {
  down: 'grid-template-rows: 0fr;',
  up: 'grid-template-rows: 0fr;',
  left: 'grid-template-columns: 0fr;',
  right: 'grid-template-columns: 0fr;'
};

export const closingTransition: Record<Stack, string> = {
  down: 'grid-template-rows 0.3s 0.6s,',
  up: 'grid-template-rows 0.3s 0.6s,',
  left: 'grid-template-columns 0.3s 0.6s,',
  right: 'grid-template-columns 0.3s 0.6s,'
};

export const stationLines = (side: Side, align: Align): Line[] => [
  plain('.banners {'),
  plain(`  ${sideMargin[side]}`),
  plain(`  ${alignMargin[align]}`),
  plain('}')
];

export const slotLines = (stack: Stack): Line[] => [
  plain('.trouble {'),
  plain('  display: grid;'),
  plain(`  ${slotTrack[stack]}`),
  plain(`  ${slotOpening[stack]}`),
  plain('}'),
  plain(' '),
  plain(ownedGap[stack])
];

export const arrivalLines = (enter: Entrance): Line[] => [
  plain('.trouble {'),
  plain('  @starting-style {'),
  plain(`    ${arriveFrom[enter]}`),
  plain('  }'),
  plain('}')
];

export const leavingLines = (stack: Stack, enter: Entrance): Line[] => [
  plain('.trouble.leaving {'),
  plain(`  ${closingSlot[stack]}`),
  plain(`  ${arriveFrom[enter]}`),
  plain('  transition:'),
  plain('    translate 0.6s cubic-bezier(0.45, 0, 0.15, 1),'),
  plain(`    ${closingTransition[stack]}`)
];

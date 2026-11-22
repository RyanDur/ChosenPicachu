const positions = ['static', 'relative', 'absolute', 'fixed', 'sticky'] as const;

export type Position = typeof positions[number];

type Told = {story: string; where: string; verdict: string; measuredFrom: string; context: string};

const told: Record<Position, Told> = {
  static: {
    story: 'Every box starts as position: static. The browser places it in the flow, as a block or inline, and ignores top and left.',
    where: 'Every box, until we say otherwise.',
    verdict: 'Second sits between First and Third. The 16px and 24px do nothing.',
    measuredFrom: 'nowhere. The browser ignores top and left.',
    context: 'It forms no stacking context.'
  },
  relative: {
    story: 'position: relative moves the box from the place the flow gave it, by top and left. The flow keeps that place open, so the boxes around it do not move.',
    where: 'A small nudge, or a parent we want a badge or a menu placed against.',
    verdict: 'Second moves 16px down and 24px right. Its old place stays open, and Third does not move.',
    measuredFrom: 'the box’s own place in the flow, shown as the dashed red outline.',
    context: 'It forms no stacking context, unless we also give it a z-index.'
  },
  absolute: {
    story: 'position: absolute takes the box out of the flow, so the boxes after it close the gap. The browser measures top and left from the nearest positioned ancestor. Here that is the parent, because we gave it position: relative.',
    where: 'A badge on a corner, a menu under its button, a close button in a dialog’s corner.',
    verdict: 'Second leaves the flow, and Third moves up into its place. Second sits 16px down and 24px in from the parent’s corner, drawn over First. It scrolls with the page.',
    measuredFrom: 'the parent’s corner, at the red dot. The parent is outlined in red because it is positioned.',
    context: 'It forms no stacking context, unless we also give it a z-index.'
  },
  fixed: {
    story: 'position: fixed takes the box out of the flow and measures top and left from the window, not the page. When the page scrolls, the box stays where it is. The little window here has a transform, so fixed is measured from it and not from the browser’s window.',
    where: 'A banner, a chat button, a header pinned to the window.',
    verdict: 'Second leaves the flow and stays put in the window while the page scrolls under it.',
    measuredFrom: 'the window’s corner, at the red dot.',
    context: 'It forms a stacking context by itself.'
  },
  sticky: {
    story: 'position: sticky leaves the box in the flow until scrolling would carry it past the edge we name, here top: 0. Then it stays at that edge.',
    where: 'A table’s header row, or a heading that stays while its section scrolls.',
    verdict: 'Second scrolls with the page, then stays at the top while the rest of its parent scrolls under it. It leaves when its parent does.',
    measuredFrom: 'the top edge of the box that scrolls, shown as the red line.',
    context: 'It forms a stacking context by itself.'
  }
};

const withNoPositionedParent: Pick<Told, 'story' | 'verdict' | 'measuredFrom'> = {
  story: 'The parent has no position now. No ancestor of Second is positioned, so the browser measures top and left from the corner of the whole page. Expect this whenever nothing above an absolute box is positioned.',
  verdict: 'Second sits 16px down and 24px in from the page’s corner, over the top of the page and outside its parent. It still scrolls with the page.',
  measuredFrom: 'the page’s corner, at the red dot. No ancestor is positioned, so the browser goes past the parent to the page.'
};

type WhereSecondGoes = {
  positions: readonly Position[];
  told: (position: Position, parentPositioned: boolean) => Told;
};

export const whereSecondGoes: WhereSecondGoes = {
  positions,
  told: (position, parentPositioned) =>
    position === 'absolute' && !parentPositioned ? {...told[position], ...withNoPositionedParent} : told[position]
};

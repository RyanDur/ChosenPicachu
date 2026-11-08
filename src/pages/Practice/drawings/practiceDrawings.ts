import {has} from '@ryandur/sand';

// the build reads this module before it reads the site, so it imports nothing of the site's own

export type Size = {readonly width: number; readonly height: number};

type Drawing = {
  readonly sheet: string;
  readonly sizes: {readonly wide: Size; readonly stacked: Size};
  readonly frames: (siteStyle: string) => {wide: string; stacked: string};
};

// a media attribute cannot read a custom property, so the widths spacing.css names --phone-held-upright and
// --nav-in-a-row are named here for the pictures
const phoneHeldUpright = '(width <= 600px)';
const railAboveTheHeader = '(width <= 1100px)';

type Box = {
  readonly label: string;
  readonly look: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly note?: string;
};

type Point = {readonly x: number; readonly y: number};

const minifiedCss = (css: string): string => css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{};])\s*/g, '$1');

const caption = (words: string, {x, y}: Point): string =>
  `<text class="drawn-caption" x="${x}" y="${y}" dominant-baseline="hanging">${words}</text>`;

const rect = ({look, x, y, width, height}: Box): string =>
  `<rect class="${look}" x="${x}" y="${y}" width="${width}" height="${height}"/>`;

// an image cannot read the page's style sheets, so each frame carries the site's own, and measures its column by its
// own width
const framed = (drawing: string, size: Size, siteStyle: string, drawn: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" class="${drawing} ink-filled" viewBox="0 0 ${size.width} ${size.height}" width="${size.width}" height="${size.height}">` +
  `<style><![CDATA[${siteStyle}:root{--drawing-column:100vw;--drawn-width:${size.width}px;}]]></style>` +
  drawn +
  '</svg>';

const margin = 6;

const sizeAround = (boxes: Box[]): Size => ({
  width: Math.max(...boxes.map(({x, width}) => x + width)) + margin,
  height: Math.max(...boxes.map(({y, height}) => y + height)) + margin
});

const whereARuleLives = ((): Drawing => {
  const inset = 6;
  const folder = 'folder-box hollow drawn';
  const group = 'group-box hollow drawn';
  const file = 'file-box hollow drawn';
  const sheet = 'sheet-box hollow drawn';

  const tokens = ['reset', 'colors', 'spacing'] as const;
  const vocabulary = ['button', 'typography', 'surface', 'drawing', 'placement', 'glide'] as const;
  const parts = ['DraggableColumn.tsx', 'RowGrip.tsx', 'SortMenu.tsx', 'ResizeHandle.tsx'] as const;
  const ownSheets = ['Table.css', 'Header.css', 'RowGrip.css'] as const;

  type Column = {readonly x: number; readonly y: number; readonly width: number; readonly look: string};
  type Wears = {readonly from: Point; readonly to: Point};

  const row = (label: string, {x, y, width, look}: Column, at: number): Box =>
    ({label, look, x, y: y + at * 24, width, height: 18});
  const column = (labels: readonly string[], placed: Column): Box[] =>
    labels.map((label, at) => row(label, placed, at));
  const rowOf = <Label extends string>(labels: readonly Label[], label: Label, placed: Column): Box =>
    row(label, placed, labels.indexOf(label));

  const tree = (x: number, y: number): {boxes: Box[]; surface: Box} => {
    const words: Column = {x: x + 18, y: y + 138, width: 174, look: file};
    return {
      boxes: [
        {label: 'src/styles', look: folder, x, y, width: 210, height: 288},
        {label: 'the reset and the tokens', look: group, x: x + 9, y: y + 24, width: 192, height: 90},
        ...column(tokens, {x: x + 18, y: y + 42, width: 174, look: file}),
        {label: 'the vocabulary, by concern', look: group, x: x + 9, y: y + 120, width: 192, height: 162},
        ...column(vocabulary, words)
      ],
      surface: rowOf(vocabulary, 'surface', words)
    };
  };

  const component = (x: number, y: number, besideEachOther: boolean): {boxes: Box[]; sortMenu: Box} => {
    const files: Column = {x: x + 12, y: y + 24, width: 126, look: file};
    const sheets: Column = besideEachOther
      ? {x: x + 150, y: y + 24, width: 126, look: sheet}
      : {x: x + 12, y: y + 138, width: 126, look: sheet};
    return {
      boxes: [
        {label: 'DragSortableTable', look: folder, x, y, width: besideEachOther ? 288 : 222, height: besideEachOther ? 138 : 288},
        ...column(parts, files),
        ...column(ownSheets, sheets)
      ],
      sortMenu: rowOf(parts, 'SortMenu.tsx', files)
    };
  };

  const liftedIn = (surface: Box): Point => ({x: surface.x + surface.width - 48, y: surface.y + inset});
  const rightMiddle = ({x, y, width, height}: Box): Point => ({x: x + width, y: y + height / 2});
  const leftMiddle = ({x, y, height}: Box): Point => ({x, y: y + height / 2});
  const topMiddle = ({x, y, width}: Box): Point => ({x: x + width / 2, y});

  const styles = tree(6, 6);
  const wideComponent = component(252, 6, false);
  const wide: Box[] = [...styles.boxes, ...wideComponent.boxes];
  const wideWears: Wears = {from: rightMiddle(styles.surface), to: leftMiddle(wideComponent.sortMenu)};
  const stackedComponent = component(6, 306, true);
  const stacked: Box[] = [...styles.boxes, ...stackedComponent.boxes];
  const stackedWears: Wears = {from: rightMiddle(styles.surface), to: topMiddle(stackedComponent.sortMenu)};

  const drawnBox = (box: Box): string =>
    rect(box) +
    caption(box.label, {x: box.x + inset, y: box.y + inset}) +
    (box.label === styles.surface.label ? caption('lifted', liftedIn(box)) : '');

  const frame = (boxes: Box[], {from, to}: Wears, siteStyle: string): string => framed('where-a-rule-lives', sizeAround(boxes), siteStyle,
    boxes.map(drawnBox).join('') +
    `<line class="wears-line drawn dashed-drawn" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"/>` +
    caption('wears', {x: (from.x + to.x) / 2 + inset, y: (from.y + to.y) / 2}));

  return {
    sheet: 'src/pages/Practice/presentation/WhereARuleLives.css',
    sizes: {wide: sizeAround(wide), stacked: sizeAround(stacked)},
    frames: siteStyle => ({wide: frame(wide, wideWears, siteStyle), stacked: frame(stacked, stackedWears, siteStyle)})
  };
})();

const landmarkMap = ((): Drawing => {
  const inset = 9;
  const landmark = 'landmark-box hollow drawn';
  const secondary = 'secondary-box hollow drawn';
  const lastOnThePage = 'landmark-box paper-filled drawn dashed-drawn';

  const wide: Box[] = [
    {label: 'section · pages and feedback', look: landmark, x: 6, y: 6, width: 180, height: 324},
    {label: 'nav · site', look: landmark, x: 18, y: 33, width: 156, height: 120},
    {label: 'feedback', look: secondary, x: 18, y: 165, width: 156, height: 54},
    {label: 'header', look: landmark, x: 195, y: 6, width: 279, height: 42},
    {label: 'main', look: landmark, x: 195, y: 57, width: 279, height: 225},
    {label: 'nav · tabs', look: secondary, x: 207, y: 96, width: 255, height: 30, note: 'only where a page has tabs'},
    {label: 'footer', look: landmark, x: 195, y: 291, width: 279, height: 39, note: 'only where a page has one'},
    {label: 'section · role alert · live region · last on the page', look: lastOnThePage, x: 186, y: 34, width: 282, height: 26}
  ];

  const stacked: Box[] = [
    {label: 'section · pages and feedback', look: landmark, x: 6, y: 6, width: 288, height: 81},
    {label: 'nav · site', look: landmark, x: 15, y: 39, width: 180, height: 39},
    {label: 'feedback', look: secondary, x: 204, y: 39, width: 81, height: 39},
    {label: 'header', look: landmark, x: 6, y: 96, width: 288, height: 42},
    {label: 'main', look: landmark, x: 6, y: 147, width: 288, height: 165},
    {label: 'nav · tabs', look: secondary, x: 15, y: 186, width: 270, height: 30, note: 'only where a page has tabs'},
    {label: 'footer', look: landmark, x: 6, y: 321, width: 288, height: 39, note: 'only where a page has one'},
    {label: 'section · role alert · live region · last on the page', look: lastOnThePage, x: 12, y: 129, width: 282, height: 24}
  ];

  const drawnBox = (box: Box): string =>
    rect(box) +
    caption(box.label, {x: box.x + inset, y: box.y + inset}) +
    (has(box.note) ? caption(box.note, {x: box.x, y: box.y + box.height + inset}) : '');

  const sizes = {wide: {width: 480, height: 356}, stacked: {width: 300, height: 388}};

  return {
    sheet: 'src/pages/Practice/structure/LandmarkMap.css',
    sizes,
    frames: siteStyle => ({
      wide: framed('landmark-map', sizes.wide, siteStyle, wide.map(drawnBox).join('')),
      stacked: framed('landmark-map', sizes.stacked, siteStyle, stacked.map(drawnBox).join(''))
    })
  };
})();

const byName = {'where-a-rule-lives': whereARuleLives, 'landmark-map': landmarkMap} as const;

export const practiceDrawings = {byName, minifiedCss, phoneHeldUpright, railAboveTheHeader};

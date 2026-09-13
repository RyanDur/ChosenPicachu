import {frameDocument, sheets} from '../assemble';
import indexCss from '../../../../../index.css?raw';
import tableHtml from '../table.html?raw';

const styleSheets = import.meta.glob<string>('../../../../../styles/*.css', {query: '?raw', import: 'default', eager: true});

const named = (path: string): string => path.slice(path.lastIndexOf('/') + 1);

describe('the frame assembly', () => {
  const manifest = [...indexCss.matchAll(/@import "styles\/(.+?)";/g)].map(([, name]) => name);

  it('no sheet rides the cascade twice', () => {
    const names = sheets.map(({name}) => name);
    expect(new Set(names).size).toBe(names.length);
    const everything = sheets.map(({css}) => css).join('\n');
    expect(everything.match(/\.off-screen\s*\{/g)).toHaveLength(1);
  });

  it('no import survives into the frame', () => {
    const everything = sheets.map(({css}) => css).join('\n');
    expect(everything.match(/@import/g)).toBeNull();
  });

  it('the cascade follows index.css into the frame', () => {
    expect(manifest.length).toBeGreaterThan(0);
    manifest.forEach(name => expect(sheets.map(({name: sheetName}) => sheetName)).toContain(name));
  });

  it('no sheet in styles/ is orphaned from the cascade', () => {
    Object.keys(styleSheets).map(named).forEach(name => expect(manifest).toContain(name));
  });

  const document = () =>
    frameDocument(
      {tradeFeed: 'wss://feed.test/', tradeHistory: 'http://history.test', tradeProduct: 'BTC-USD'},
      {pace: 'eager', origin: 'hide', motion: 'animated'});

  it('the document carries the whole cascade', () => {
    sheets.forEach(({css}) => expect(document()).toContain(css));
    expect(document()).toContain('::view-transition-group(*)');
    expect(document()).not.toContain('@import');
  });

  it('the document carries the starting table dressed by the dials', () => {
    expect(document()).toContain(tableHtml.replace('class="fancy-table sortable apportioned"', 'class="fancy-table sortable apportioned hide animated"'));
  });

  it('the document carries its environment', () => {
    expect(document()).toContain('"tradeFeed":"wss://feed.test/"');
    expect(document()).toContain('"pace":"eager"');
  });
});

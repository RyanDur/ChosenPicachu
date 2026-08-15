import {frameDocument, sheets} from '../assemble';
import indexCss from '../../../../../index.css?raw';
import tableHtml from '../table.html?raw';

const styleSheets = import.meta.glob<string>('../../../../../styles/*.css', {query: '?raw', import: 'default', eager: true});

const named = (path: string): string => path.slice(path.lastIndexOf('/') + 1);

describe('the frame assembly', () => {
  const manifest = [...indexCss.matchAll(/@import "styles\/(.+?)";/g)].map(([, name]) => name);

  it('the cascade follows index.css into the frame', () => {
    expect(manifest.length).toBeGreaterThan(0);
    manifest.forEach(name => expect(sheets.map(({name: sheetName}) => sheetName)).toContain(name));
  });

  it('no sheet in styles/ is orphaned from the cascade', () => {
    Object.keys(styleSheets).map(named).forEach(name => expect(manifest).toContain(name));
  });

  it('the document carries the cascade and the dealt table, with no unresolvable imports', () => {
    sheets.forEach(({css}) => expect(frameDocument).toContain(css));
    expect(frameDocument).toContain(tableHtml);
    expect(frameDocument).not.toContain('@import');
  });
});

import {foldDocument, sheets} from '../assemble';

describe('the plain fold’s assembly', () => {
  it('rides the site’s cascade and the accordions’ own sheet, each once', () => {
    const names = sheets.map(({name}) => name);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toContain('Accordions.css');
  });

  it('fills every slot in its document, the script included', () => {
    const document = foldDocument();
    expect(document).not.toContain('/* the cascade */');
    expect(document).not.toContain('/* the script */');
    expect(document).toContain('.info-measured');
    expect(document).toMatch(/addEventListener\(["']transitionend["']/);
  });
});

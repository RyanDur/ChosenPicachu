import {foldAssembly} from '../assemble';

describe('the plain fold’s assembly', () => {
  it('rides the site’s cascade and the accordions’ own sheet, each once', () => {
    const names = foldAssembly.sheets.map(({name}) => name);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toContain('Accordions.css');
  });

  it('fills every gap in its markup, the script included', () => {
    const markup = foldAssembly.markup();
    expect(markup).not.toContain('/* the cascade */');
    expect(markup).not.toContain('/* the script */');
    expect(markup).toContain('.info-measured');
    expect(markup).toMatch(/addEventListener\(["']transitionend["']/);
  });
});

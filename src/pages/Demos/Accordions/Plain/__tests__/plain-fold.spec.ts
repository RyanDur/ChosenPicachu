import {plainFold} from '../plain-fold';
import {plainFoldChange} from '../plain-fold-change';

describe('the plain fold’s frame', () => {
  it('watches the body of the last document it loaded, so a blank page loaded first is let go', () => {
    const blank = document.createElement('body');
    const assembled = document.createElement('body');
    const loadedBlank = plainFold.reduce(plainFold.initial, plainFoldChange.loaded(blank));

    expect(plainFold.reduce(loadedBlank, plainFoldChange.loaded(assembled)).body).toBe(assembled);
  });
});

import {has} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';

const hangs = (): Promise<HTMLElement[]> => screen.findAllByRole('figure');

export const galleryWall = {
  hangs,
  frameTitled: async (title: string): Promise<HTMLElement> => {
    const frame = (await hangs()).find(figure => has(within(figure).queryByText(title)));
    if (has(frame)) return frame;
    throw new Error(`no frame titled ${title}`);
  }
};

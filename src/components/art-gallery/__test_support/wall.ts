import {has} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const framesAppear = (): Promise<HTMLElement[]> => screen.findAllByRole('figure');
const loadingSign = {name: 'loading gallery'};

const frameTitled = async (title: string): Promise<HTMLElement> => {
  const frame = (await framesAppear()).find(figure => has(within(figure).queryByText(title)));
  if (has(frame)) return frame;
  throw new Error(`no frame titled ${title}`);
};

export const galleryWall = {
  framesAppear,
  openPiece: async (title: string): Promise<void> => userEvent.click(within(await frameTitled(title)).getByRole('img')),
  pieceStillComing: (): Promise<HTMLElement> => screen.findByRole('heading', {name: 'A piece'}),
  frames: (): HTMLElement[] => screen.queryAllByRole('figure'),
  pictures: async (): Promise<HTMLElement[]> => (await framesAppear()).map(figure => within(figure).getByRole('img')),
  loadingSignAppears: (): Promise<HTMLElement> => screen.findByRole('progressbar', loadingSign),
  loadingSign: (): HTMLElement | null => screen.queryByRole('progressbar', loadingSign),
  standIn: (saying: string): Promise<HTMLElement> => screen.findByRole('img', {name: saying}),
  frameTitled
};

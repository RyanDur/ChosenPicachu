import {maybe} from '@ryandur/sand';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const stopsBeforeGivingUp = 100;

const hideParts = (): Promise<HTMLElement> =>
  screen.findByRole('button', {name: 'Hide parts'});

const tabTo = async (target: HTMLElement): Promise<void> => {
  for (let stop = 0; stop < stopsBeforeGivingUp; stop += 1) {
    if (document.activeElement === target) return;
    await userEvent.tab();
  }
  throw new Error('Tab never reached Hide parts');
};

export const partsFold = {
  offersHideParts: (): Promise<HTMLElement> => screen.findByRole('button', {name: 'Hide parts', expanded: true}),
  offersShowParts: (): Promise<HTMLElement> => screen.findByRole('button', {name: 'Show parts', expanded: false}),
  panelControlled: async (): Promise<HTMLElement | null> =>
    maybe((await hideParts()).getAttribute('aria-controls')).mBind(id => maybe(document.getElementById(id))).orNull(),
  offered: (): HTMLElement | null => screen.queryByRole('button', {name: /^(Hide|Show) parts$/}),
  enterOnHideParts: async (): Promise<void> => {
    const hide = await hideParts();
    await waitFor(() => {
      if (hide.hasAttribute('disabled')) throw new Error('Hide parts waits for the script');
    });
    await tabTo(hide);
    await userEvent.keyboard('{Enter}');
  }
};

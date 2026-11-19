import {screen, within} from '@testing-library/react';

export const galleryRegions = {
  settings: () => within(screen.getByRole('complementary', {name: 'gallery settings'})),
  banner: () => within(screen.getByRole('banner'))
};

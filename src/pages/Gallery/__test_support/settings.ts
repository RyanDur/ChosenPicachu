import {screen, within} from '@testing-library/react';

export const gallerySettings = () => within(screen.getByRole('complementary', {name: 'gallery settings'}));
export const galleryBanner = () => within(screen.getByRole('banner'));

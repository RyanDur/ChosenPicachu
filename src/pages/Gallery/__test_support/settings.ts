import {screen, within} from '@testing-library/react';

export const gallerySettings = () => within(screen.getByRole('group', {name: 'gallery settings'}));

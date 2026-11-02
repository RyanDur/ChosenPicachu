import {screen} from '@testing-library/react';

export const chartPage = {
  storyHeading: (description: string): Promise<HTMLElement> =>
    screen.findByRole('heading', {name: description.replace(/\.$/, '')})
};

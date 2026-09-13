import {Paths} from '@pages/Paths';
import {TestApp} from '@test-support/TestApp';
import {render, screen} from '@testing-library/react';

describe('Games', () => {
  test('can see the games page', async () => {
    render(<TestApp at={Paths.games}/>);

    expect(await screen.findByText('Play Games')).toBeInTheDocument();
  });
});
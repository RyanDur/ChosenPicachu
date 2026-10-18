import {render, screen} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {FromTheRecord} from '@pages/Home/FromTheRecord';

describe('a concern’s part outside a concern section', () => {
  test('should draw nothing, so it passes as no concern at all', async () => {
    render(<TestApp>
      <FromTheRecord/>
    </TestApp>);

    await screen.findByRole('status', {name: 'url path'});

    expect(screen.queryAllByRole('region', {name: /from the record/})).toEqual([]);
    expect(screen.queryByRole('list', {name: /from the record/})).not.toBeInTheDocument();
  });
});

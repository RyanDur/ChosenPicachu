import {render, screen} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {FromTheRecord} from '@pages/Home/FromTheRecord';
import {HowIOrganizeIt} from '@pages/Home/HowIOrganizeIt';

describe('a door’s part outside a door section', () => {
  test('should draw nothing, so it passes as no door at all', async () => {
    render(<TestApp>
      <FromTheRecord keys={['need']}/>
      <HowIOrganizeIt><p>The skeleton comes first.</p></HowIOrganizeIt>
    </TestApp>);

    expect(await screen.findByRole('status', {name: 'url path'})).toHaveTextContent('/');
    expect(screen.queryAllByRole('region', {name: /from the record|how I organize it/})).toEqual([]);
    expect(screen.queryByRole('list', {name: /from the record/})).not.toBeInTheDocument();
    expect(screen.queryByText('The skeleton comes first.')).not.toBeInTheDocument();
  });
});

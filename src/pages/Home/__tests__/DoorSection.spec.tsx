import {render, screen} from '@testing-library/react';
import {FromTheRecord} from '@pages/Home/FromTheRecord';
import {HowIOrganizeIt} from '@pages/Home/HowIOrganizeIt';

describe('a door’s part outside a door section', () => {
  test('should draw nothing, so it passes as no door at all', () => {
    render(<>
      <FromTheRecord keys={['need']}/>
      <HowIOrganizeIt><p>The skeleton comes first.</p></HowIOrganizeIt>
    </>);

    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByText('The skeleton comes first.')).not.toBeInTheDocument();
  });
});

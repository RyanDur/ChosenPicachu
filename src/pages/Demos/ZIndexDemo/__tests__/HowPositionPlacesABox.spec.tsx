import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Paths} from '@navigation';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';

const howPosition = 'z-index/how-position-places-a-box';
const title = 'How position places a box';

describe('how position places a box, on its own page', () => {
  test('should link why Third is on top, which it builds on, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(howPosition, '?raised=second')}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(explanation.opener(part), 'Why Third is on top')).toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?raised=second'));
  });

  test('should link stacking context, at its first use, to the tab’s page, which defines it', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(part, 'stacking context')).toHaveAttribute('href', `${Paths.demos}z-index/`);
  });

  test('should link positioned, with Second absolute, to part one’s page with the raised card carried', async () => {
    render(<TestApp at={demosAt(howPosition, '?raised=second')}/>);
    const part = await explanation.part(title);

    await userEvent.click(within(screen.getByRole('group', {name: 'Second’s position is'})).getByRole('radio', {name: 'absolute'}));

    expect(explanation.linkNamed(part, 'positioned')).toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?raised=second'));
  });
});

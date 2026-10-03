import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';

const oldBanner = /^An old banner\./;

describe('the old banner', () => {
  test('should say nothing until it is raised', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    await screen.findByRole('button', {name: 'Raise the old banner'});

    expect(screen.queryByText(oldBanner)).not.toBeInTheDocument();
  });

  test('should be announced when raised from card one', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    await userEvent.click(await screen.findByRole('button', {name: 'Raise the old banner'}));

    expect(screen.getAllByRole('alert').some(alert => oldBanner.test(alert.textContent))).toBe(true);
  });

  test('should leave when dismissed, and give focus back to the button that raised it', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    await userEvent.click(await screen.findByRole('button', {name: 'Raise the old banner'}));

    await userEvent.click(screen.getByRole('button', {name: 'dismiss the old banner'}));

    expect(screen.queryByText(oldBanner)).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Raise the old banner'})).toHaveFocus();
  });
});

describe('why a fixed banner still loses', () => {
  test('should show the old banner’s rule and card one’s context beside the run that raises it', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why a fixed banner still loses'});

    expect(explanation.everyCodeBeside(part, /Raise the old banner from card one/).join())
      .toMatch(/\.old-banner \{[^]*position: fixed[^]*z-index: 9999[^]*\.forms-context \{[^]*z-index: 1/);
  });

  test('should show the site’s banner markup beside the run about the banner in the top layer', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why a fixed banner still loses'});

    expect(explanation.everyCodeBeside(part, /It is the site’s own banner/).join()).toMatch(/popover="manual"[^]*role="alert"/);
  });

  test('should open the banner tutorial at the step that makes it a popover', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const part = await screen.findByRole('region', {name: 'Why a fixed banner still loses'});

    await userEvent.click(within(part).getByRole('link', {name: 'the tutorial below'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('news=top');
  });
});

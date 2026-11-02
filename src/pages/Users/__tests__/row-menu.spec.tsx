import {TestApp} from '@__test_support/TestApp';
import {render, screen, waitFor, within} from '@testing-library/react';
import {computeAccessibleName} from 'dom-accessibility-api';
import {Paths} from '@pages/Paths';
import {aUser, setupUsersResponse} from '@components/Users/__test_support';

describe('the row menu is a popover anchored to its toggle', () => {
  const firstRow = async () => {
    setupUsersResponse([aUser(), aUser()]);
    render(<TestApp at={Paths.users}/>);
    await waitFor(() => expect(screen.getAllByRole('row').length).toBeGreaterThan(1));
    return screen.getAllByRole('row')[1];
  };

  const menuFor = (toggle: HTMLElement): HTMLElement =>
    screen.getByLabelText(`${toggle.getAttribute('aria-label') ?? ''}, chosen`);

  test("each row's actions button has a menu of its own that opens as a popover", async () => {
    const row = await firstRow();
    const toggle = within(row).getByRole('button', {name: /^Actions for /});

    expect(menuFor(toggle).getAttribute('popover')).toBe('auto');
  });

  test('the menu offers every row action', async () => {
    const row = await firstRow();
    const toggle = within(row).getByRole('button', {name: /^Actions for /});

    expect(within(menuFor(toggle)).getAllByRole('link', {hidden: true}).map(link => computeAccessibleName(link))).toEqual(['View', 'Edit', 'Clone']);
    expect(within(menuFor(toggle)).getByRole('button', {name: 'Remove', hidden: true})).toBeInTheDocument();
  });
});

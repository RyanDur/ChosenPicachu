import {screen, waitFor, within} from '@testing-library/react';
import {renderWithMemoryRouter} from '@test-support';
import {Users} from '@pages/index';
import {Paths} from '@pages/Paths';

describe('the row menu is a popover anchored to its toggle', () => {
  const firstRow = async () => {
    renderWithMemoryRouter(Users, {path: Paths.users});
    await waitFor(() => expect(screen.getAllByRole('row').length).toBeGreaterThan(1));
    return screen.getAllByRole('row')[1];
  };

  const menuFor = (toggle: HTMLElement): HTMLElement => {
    const target = toggle.getAttribute('popovertarget') ?? '';
    expect(target).toMatch(/^menu-/);
    const menu = document.getElementById(target);
    if (menu === null) throw new Error(`no menu with id ${target}`);
    return menu;
  };

  test('the toggle is a real button wired to its own menu', async () => {
    const row = await firstRow();
    const toggle = within(row).getByRole('button', {name: /^Actions for /});

    expect(menuFor(toggle).getAttribute('popover')).toBe('auto');
  });

  test('the menu offers every row action', async () => {
    const row = await firstRow();
    const toggle = within(row).getByRole('button', {name: /^Actions for /});

    ['View', 'Edit', 'Remove', 'Clone'].forEach(action =>
      expect(within(menuFor(toggle)).getByText(action)).toBeInTheDocument());
  });
});

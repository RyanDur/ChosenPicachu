import {TestApp} from '@__test_support/TestApp';
import {render} from '@testing-library/react';
import {Paths} from '@frame/navigation';
import {aUser, setupUsersResponse} from '@pages/Users/__test_support';
import {rowMenu} from '@pages/Users/__test_support';

describe('the row menu', () => {
  test('the menu offers every row action', async () => {
    setupUsersResponse([aUser(), aUser()]);
    render(<TestApp at={Paths.users}/>);

    const toggle = await rowMenu.firstToggle();

    expect(rowMenu.actions(toggle)).toEqual(['View', 'Edit', 'Clone']);
    expect(rowMenu.removal(toggle)).toBeInTheDocument();
  });
});

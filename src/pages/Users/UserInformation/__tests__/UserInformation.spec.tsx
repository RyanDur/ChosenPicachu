import {ReactNode} from 'react';
import {UserInformation} from '../index';
import {UsersProvider} from '../../Provider';
import {UsersAction, UsersListener, usersStore} from '../../store';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {addressGroup, fillOutForm} from '../__test_support';
import {initialState} from '../reducer';
import {NewUser} from '@components/Users/UserInfo/types';
import {toDate} from 'date-fns';


const added = (): { form: ReactNode; adds: () => readonly unknown[] } => {
  const heard: UsersAction[] = [];
  const hearing: UsersListener = (_previous, _current, _dispatch, action) => {
    heard.push(action);
  };
  const store = usersStore(hearing);
  return {
    form: <UsersProvider store={store}><UserInformation/></UsersProvider>,
    adds: () => heard.filter(action => action.type === 'userAdded').map(action => action.type === 'userAdded' ? action.user : undefined)
  };
};

describe('a user form', () => {
  const info: NewUser = {
    info: {
      firstName: 'Teruko',
      lastName: 'Okada',
      email: 'teruko@example.com',
      dob: toDate('1984-06-02')
    },
    friends: [],
    homeAddress: {
      streetAddress: '12 Elm St',
      streetAddressTwo: 'Apt. 3',
      city: 'Springfield',
      state: 'IL',
      zip: '62704'
    },
    workAddress: {
      streetAddress: '9 Oak Ave',
      streetAddressTwo: 'Suite 2',
      city: 'Chatham',
      state: 'IL',
      zip: '62629'
    },
    details: 'short notes',
    avatar: initialState.avatar
  };
  const userInfo = info;

  describe('filled out', () => {
    it('should be resettable', async () => {
      const {form, adds} = added();
      render(form);
      await fillOutForm(userInfo);

      await userEvent.type(screen.getByLabelText('Details'), userInfo.details!);
      await userEvent.click(screen.getByText('Reset'));
      await userEvent.click(screen.getByText('Add'));

      expect(screen.getByLabelText('First Name')).toHaveValue('');
      expect(adds()).toEqual([]);
    });

    describe('when adding a user', () => {
      it('should submit all the data', async () => {
        const {form, adds} = added();

        render(form);

        await fillOutForm(info);
        await userEvent.type(screen.getByLabelText('Details'), userInfo.details!);
        await userEvent.click(screen.getByText('Add'));

        await waitFor(() => expect(adds()).toEqual([info]));
      });

      it('should reset the form', async () => {
        const {form, adds} = added();
        render(form);
        await fillOutForm(userInfo);

        await userEvent.click(screen.getByText('Add'));
        await userEvent.click(screen.getByText('Add'));

        expect(screen.getByLabelText('First Name')).toHaveValue('');
        expect(adds()).toHaveLength(1);
      });
    });

    describe('work address', () => {
      test('should allow the user to auto copy the home address', async () => {
        const {form, adds} = added();
        render(form);

        await fillOutForm(info);
        await userEvent.type(screen.getByLabelText('Details'), info.details!);
        await userEvent.click(screen.getByLabelText('Same as Home'));
        await userEvent.click(screen.getByText('Add'));

        expect(adds()).toEqual([{
          ...info,
          workAddress: info.homeAddress
        }]);
      });
    });
  });

  describe('validity', () => {
    it('should have some required fields', () => {
      render(added().form);

      expect(screen.getByLabelText('First Name')).not.toBeValid();
      expect(screen.getByLabelText('Last Name')).not.toBeValid();
      expect(screen.getByLabelText('Date Of Birth')).not.toBeValid();
      expect(addressGroup('home').getByLabelText('Street')).not.toBeValid();
      expect(addressGroup('home').getByLabelText('City')).not.toBeValid();
      expect(addressGroup('home').getByLabelText('State')).not.toBeValid();
      expect(addressGroup('home').getByLabelText('Postal / Zip code')).not.toBeValid();
    });

    describe('for a zip code', () => {
      const homeZip = (): HTMLElement => addressGroup('home').getByLabelText('Postal / Zip code');

      test('a letter is refused', async () => {
        render(added().form);

        await userEvent.type(homeZip(), 'a');

        expect(homeZip()).toHaveDisplayValue('a');
        expect(homeZip()).not.toBeValid();
      });

      test('one digit is not yet a zip', async () => {
        render(added().form);

        await userEvent.type(homeZip(), '1');

        expect(homeZip()).toHaveDisplayValue('1');
        expect(homeZip()).not.toBeValid();
      });

      test('five digits are a zip', async () => {
        render(added().form);

        await userEvent.type(homeZip(), '60012');

        expect(homeZip()).toHaveDisplayValue('60012');
        expect(homeZip()).toBeValid();
      });

      test('five digits, a dash and four more are a zip', async () => {
        render(added().form);

        await userEvent.type(homeZip(), '12345-1234');

        expect(homeZip()).toHaveDisplayValue('12345-1234');
        expect(homeZip()).toBeValid();
      });

    });
  });
});

describe('the avatar control plays fair with the keyboard', () => {
  test('enter regenerates the avatar, like a click does', async () => {
    render(added().form);
    const avatar = screen.getByRole('button', {name: 'Generate a new avatar'});
    const before = screen.getByAltText<HTMLImageElement>('avatar').src;
    avatar.focus();

    await userEvent.keyboard('{enter}');

    expect(screen.getByAltText<HTMLImageElement>('avatar').src).not.toEqual(before);
  });

  test('space regenerates the avatar, like a click does', async () => {
    render(added().form);
    const avatar = screen.getByRole('button', {name: 'Generate a new avatar'});
    const before = screen.getByAltText<HTMLImageElement>('avatar').src;
    avatar.focus();

    await userEvent.keyboard(' ');

    expect(screen.getByAltText<HTMLImageElement>('avatar').src).not.toEqual(before);
  });
});

describe('the keyboard walks the whole form', () => {
  test('tab visits each control once and always gets out the other side', async () => {
    render(added().form);
    const form = screen.getByRole('form', {name: 'user info'});
    await userEvent.click(screen.getByLabelText('First Name'));

    const visited: Element[] = [];
    let guard = 0;
    while (document.activeElement && form.contains(document.activeElement) && guard < 50) {
      expect(visited, 'tab revisited a control — a trap').not.toContain(document.activeElement);
      visited.push(document.activeElement);
      await userEvent.tab();
      guard += 1;
    }

    expect(form.contains(document.activeElement), 'tab never escaped the form').toBe(false);
    expect(visited.length).toBeGreaterThanOrEqual(10);
  });
});

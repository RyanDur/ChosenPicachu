import {ReactNode} from 'react';
import {UserInformation} from '../index';
import {UsersProvider} from '../../Provider';
import {UsersAction, UsersListener, usersStore} from '../../store';
import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {addressGroup, fillOutForm} from '../__test_support';
import {AddressInfo, NewUser} from '@components/Users/UserInfo/user';

const added = (): {form: ReactNode; adds: () => readonly unknown[]} => {
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

const avatarShown = (): string => screen.getByAltText<HTMLImageElement>('avatar').src;

const addButton = (): HTMLElement => screen.getByRole('button', {name: 'Add'});

const sameAsHome = (): HTMLElement => screen.getByRole('checkbox', {name: 'Same as Home'});

describe('a user form', () => {
  const info: Pick<NewUser, 'info' | 'homeAddress'> & {work: AddressInfo; details: string} = {
    info: {
      firstName: 'Teruko',
      lastName: 'Okada',
      email: 'teruko@example.com',
      dob: new Date(1984, 5, 2)
    },
    homeAddress: {
      streetAddress: '12 Elm St',
      streetAddressTwo: 'Apt. 3',
      city: 'Springfield',
      state: 'IL',
      zip: '62704'
    },
    work: {
      streetAddress: '9 Oak Ave',
      streetAddressTwo: 'Suite 2',
      city: 'Chatham',
      state: 'IL',
      zip: '62629'
    },
    details: 'short notes'
  };

  describe('filled out', () => {
    it('resetting empties a filled-out form', async () => {
      render(added().form);
      await fillOutForm(info);
      await userEvent.type(screen.getByLabelText('Details'), info.details);

      await userEvent.click(screen.getByRole('button', {name: 'Reset'}));

      expect(screen.getByLabelText('First Name')).toHaveValue('');
    });

    it('an empty form adds nobody', async () => {
      const {form, adds} = added();
      render(form);

      await userEvent.click(addButton());

      expect(adds()).toEqual([]);
    });

    describe('when adding a user', () => {
      it('should submit all the data', async () => {
        const {form, adds} = added();

        render(form);

        await fillOutForm(info);
        await userEvent.type(screen.getByLabelText('Details'), info.details);
        const avatar = avatarShown();
        await userEvent.click(addButton());

        await waitFor(() => expect(adds()).toEqual([{...info, friends: [], avatar}]));
      });

      it('the form empties once a user is added', async () => {
        const {form, adds} = added();
        render(form);
        await fillOutForm(info);

        await userEvent.click(addButton());

        expect(screen.getByLabelText('First Name')).toHaveValue('');
        expect(adds()).toHaveLength(1);
      });

      it('the fresh form after adding wears a new avatar', async () => {
        render(added().form);
        await fillOutForm(info);
        const submitted = avatarShown();

        await userEvent.click(addButton());

        expect(avatarShown()).not.toEqual(submitted);
      });
    });

    describe('work address', () => {
      test('the work address group is named Work Address alone, with Same as Home inside it', () => {
        const {form} = added();
        render(form);

        expect(within(screen.getByRole('group', {name: 'Work Address'})).getByRole('checkbox', {name: 'Same as Home'})).toBeInTheDocument();
      });

      test('should allow the user to auto copy the home address', async () => {
        const {form, adds} = added();
        render(form);

        await fillOutForm(info);
        await userEvent.type(screen.getByLabelText('Details'), info.details);
        await userEvent.click(sameAsHome());
        const avatar = avatarShown();
        await userEvent.click(addButton());

        expect(adds()).toEqual([{
          ...info,
          friends: [],
          avatar,
          work: 'home'
        }]);
      });

      test('ticking Same as Home shows the home address in the work fields, disabled', async () => {
        const {form} = added();
        render(form);
        await fillOutForm(info);

        await userEvent.click(sameAsHome());

        expect(addressGroup('work').getByLabelText('Street')).toHaveValue(info.homeAddress.streetAddress);
        expect(addressGroup('work').getByLabelText('City')).toHaveValue(info.homeAddress.city);
        expect(addressGroup('work').getByLabelText('Postal / Zip code')).toHaveValue(info.homeAddress.zip);
        expect(addressGroup('work').getByLabelText('Street')).toBeDisabled();
      });

      test('unticking Same as Home gives back the work address that was typed', async () => {
        const {form} = added();
        render(form);
        await fillOutForm(info);
        await userEvent.click(sameAsHome());

        await userEvent.click(sameAsHome());

        expect(addressGroup('work').getByLabelText('Street')).toHaveValue(info.work.streetAddress);
        expect(addressGroup('work').getByLabelText('City')).toHaveValue(info.work.city);
        expect(addressGroup('work').getByLabelText('Postal / Zip code')).toHaveValue(info.work.zip);
        expect(addressGroup('work').getByLabelText('Street')).toBeEnabled();
      });

      test('the fresh form after adding has the box unticked and the work address open', async () => {
        render(added().form);
        await fillOutForm(info);
        await userEvent.click(sameAsHome());

        await userEvent.click(addButton());

        expect(sameAsHome()).not.toBeChecked();
        expect(addressGroup('work').getByLabelText('Street')).toBeEnabled();
        expect(addressGroup('work').getByLabelText('Street')).toHaveValue('');
      });
    });
  });

  describe('validity', () => {
    it('a user cannot be added without a name, a birthday and a home address', () => {
      render(added().form);

      expect(screen.getByLabelText('First Name')).not.toBeValid();
      expect(screen.getByLabelText('Last Name')).not.toBeValid();
      expect(screen.getByLabelText('Date Of Birth')).not.toBeValid();
      expect(addressGroup('home').getByLabelText('Street')).not.toBeValid();
      expect(addressGroup('home').getByLabelText('City')).not.toBeValid();
      expect(addressGroup('home').getByLabelText('State')).not.toBeValid();
      expect(addressGroup('home').getByLabelText('Postal / Zip code')).not.toBeValid();
    });

    test('clearing the date of birth leaves it empty and wanting', async () => {
      render(added().form);
      await userEvent.type(screen.getByLabelText('Date Of Birth'), '1984-06-02');

      await userEvent.clear(screen.getByLabelText('Date Of Birth'));

      expect(screen.getByLabelText('Date Of Birth')).toHaveValue('');
      expect(screen.getByLabelText('Date Of Birth')).not.toBeValid();
    });

    describe('for a zip code', () => {
      const homeZip = (): HTMLElement => addressGroup('home').getByLabelText('Postal / Zip code');

      test('a letter in the zip leaves it invalid', async () => {
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
  test('enter draws a new avatar, like a click does', async () => {
    render(added().form);
    const avatar = screen.getByRole('button', {name: 'Draw a new avatar'});
    const before = screen.getByAltText<HTMLImageElement>('avatar').src;
    avatar.focus();

    await userEvent.keyboard('{enter}');

    expect(screen.getByAltText<HTMLImageElement>('avatar').src).not.toEqual(before);
  });

  test('space draws a new avatar, like a click does', async () => {
    render(added().form);
    const avatar = screen.getByRole('button', {name: 'Draw a new avatar'});
    const before = screen.getByAltText<HTMLImageElement>('avatar').src;
    avatar.focus();

    await userEvent.keyboard(' ');

    expect(screen.getByAltText<HTMLImageElement>('avatar').src).not.toEqual(before);
  });

  test('every new avatar is announced', async () => {
    render(added().form);
    expect(screen.getByRole('status', {name: 'avatar report'})).toBeEmptyDOMElement();

    await userEvent.click(screen.getByRole('button', {name: 'Draw a new avatar'}));
    expect(screen.getByRole('status', {name: 'avatar report'})).toHaveTextContent('1 new avatar drawn.');

    await userEvent.click(screen.getByRole('button', {name: 'Draw a new avatar'}));
    expect(screen.getByRole('status', {name: 'avatar report'})).toHaveTextContent('2 new avatars drawn.');
  });
});

describe('the keyboard walks the whole form', () => {
  test('tab visits each control once and always gets out the other side', async () => {
    render(added().form);
    const form = screen.getByRole('form', {name: 'User Information'});
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

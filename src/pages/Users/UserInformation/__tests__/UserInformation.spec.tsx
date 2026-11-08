import {ReactNode} from 'react';
import {render, waitFor} from '@testing-library/react';
import {Paths} from '@navigation';
import {TestApp} from '@__test_support/TestApp';
import {UserInformation} from '../index';
import {UsersProvider} from '../../UsersProvider';
import {userForm} from '../__test_support';
import {setupUsersResponse, userAddsHeard, userAddsHeld} from '@pages/Users/__test_support';
import {Address, NewUser} from '../../profile';

const added = (): {form: ReactNode; adds: () => readonly unknown[]} => {
  setupUsersResponse([]);
  return {
    form: <TestApp at={Paths.users}><UsersProvider><UserInformation/></UsersProvider></TestApp>,
    adds: userAddsHeard()
  };
};

const asSent = (user: NewUser): unknown => JSON.parse(JSON.stringify(user));

describe('a user form', () => {
  const filledIn: Pick<NewUser, 'person' | 'homeAddress'> & {work: Address; details: string} = {
    person: {
      firstName: 'Teruko',
      lastName: 'Okada',
      email: 'teruko@example.com',
      dateOfBirth: new Date(1984, 5, 2)
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
      await userForm.fillOut(filledIn);
      await userForm.typeDetails(filledIn.details);

      await userForm.reset();

      expect(userForm.field('First Name')).toHaveValue('');
    });

    it('an empty form adds nobody', async () => {
      const {form, adds} = added();
      render(form);

      await userForm.add();
      await userForm.fillOut(filledIn);
      await userForm.typeDetails(filledIn.details);
      const avatar = userForm.avatarShown();
      await userForm.add();

      await waitFor(() => expect(adds()).toEqual([asSent({...filledIn, friends: [], avatar})]));
    });

    describe('when adding a user', () => {
      it('should submit all the data', async () => {
        const {form, adds} = added();

        render(form);

        await userForm.fillOut(filledIn);
        await userForm.typeDetails(filledIn.details);
        const avatar = userForm.avatarShown();
        await userForm.add();

        await waitFor(() => expect(adds()).toEqual([asSent({...filledIn, friends: [], avatar})]));
      });

      it('the form empties once a user is added', async () => {
        const {form, adds} = added();
        render(form);
        await userForm.fillOut(filledIn);

        await userForm.add();

        await waitFor(() => expect(userForm.field('First Name')).toHaveValue(''));
        expect(adds()).toHaveLength(1);
      });

      it('a second press while an add is in flight adds the user once', async () => {
        const {form} = added();
        const adds = userAddsHeld();
        render(form);
        await userForm.fillOut(filledIn);
        await userForm.add();
        await waitFor(() => expect(adds.heard()).toBe(1));

        await userForm.add();
        adds.answer();

        await waitFor(() => expect(userForm.field('First Name')).toHaveValue(''));
        expect(adds.heard()).toBe(1);
      });

      it('Add says it is unavailable while an add is in flight', async () => {
        const {form} = added();
        const adds = userAddsHeld();
        render(form);
        await userForm.fillOut(filledIn);

        await userForm.add();

        await waitFor(() => expect(userForm.addButton()).toHaveAttribute('aria-disabled', 'true'));
        adds.answer();
        await waitFor(() => expect(userForm.addButton()).not.toHaveAttribute('aria-disabled', 'true'));
      });

      it('focus stays on Add after a confirmed add', async () => {
        render(added().form);
        await userForm.fillOut(filledIn);

        await userForm.add();

        await waitFor(() => expect(userForm.field('First Name')).toHaveValue(''));
        expect(userForm.addButton()).toHaveFocus();
      });

      it('the fresh form after adding wears a new avatar', async () => {
        render(added().form);
        await userForm.fillOut(filledIn);
        const submitted = userForm.avatarShown();

        await userForm.add();

        await waitFor(() => expect(userForm.avatarShown()).not.toEqual(submitted));
      });
    });

    describe('work address', () => {
      test('the work address group is named Work Address alone, with Same as Home inside it', () => {
        const {form} = added();
        render(form);

        expect(userForm.sameAsHomeInWorkAddress()).toBeInTheDocument();
      });

      test('should allow the user to auto copy the home address', async () => {
        const {form, adds} = added();
        render(form);

        await userForm.fillOut(filledIn);
        await userForm.typeDetails(filledIn.details);
        await userForm.tickSameAsHome();
        const avatar = userForm.avatarShown();
        await userForm.add();

        await waitFor(() => expect(adds()).toEqual([asSent({
          ...filledIn,
          friends: [],
          avatar,
          work: 'home'
        })]));
      });

      test('ticking Same as Home shows the home address in the work fields, disabled', async () => {
        const {form} = added();
        render(form);
        await userForm.fillOut(filledIn);

        await userForm.tickSameAsHome();

        expect(userForm.addressField('work', 'Street')).toHaveValue(filledIn.homeAddress.streetAddress);
        expect(userForm.addressField('work', 'City')).toHaveValue(filledIn.homeAddress.city);
        expect(userForm.addressField('work', 'Postal / Zip code')).toHaveValue(filledIn.homeAddress.zip);
        expect(userForm.addressField('work', 'Street')).toBeDisabled();
      });

      test('unticking Same as Home gives back the work address that was typed', async () => {
        const {form} = added();
        render(form);
        await userForm.fillOut(filledIn);
        await userForm.tickSameAsHome();

        await userForm.tickSameAsHome();

        expect(userForm.addressField('work', 'Street')).toHaveValue(filledIn.work.streetAddress);
        expect(userForm.addressField('work', 'City')).toHaveValue(filledIn.work.city);
        expect(userForm.addressField('work', 'Postal / Zip code')).toHaveValue(filledIn.work.zip);
        expect(userForm.addressField('work', 'Street')).toBeEnabled();
      });

      test('the fresh form after adding has the box unticked and the work address open', async () => {
        render(added().form);
        await userForm.fillOut(filledIn);
        await userForm.tickSameAsHome();

        await userForm.add();

        await waitFor(() => expect(userForm.sameAsHome()).not.toBeChecked());
        expect(userForm.addressField('work', 'Street')).toBeEnabled();
        expect(userForm.addressField('work', 'Street')).toHaveValue('');
      });
    });
  });

  describe('validity', () => {
    it('a user cannot be added without a name, a birthday and a home address', () => {
      render(added().form);

      expect(userForm.field('First Name')).not.toBeValid();
      expect(userForm.field('Last Name')).not.toBeValid();
      expect(userForm.field('Date Of Birth')).not.toBeValid();
      expect(userForm.addressField('home', 'Street')).not.toBeValid();
      expect(userForm.addressField('home', 'City')).not.toBeValid();
      expect(userForm.addressField('home', 'State')).not.toBeValid();
      expect(userForm.addressField('home', 'Postal / Zip code')).not.toBeValid();
    });

    test('clearing the date of birth leaves it empty and wanting', async () => {
      render(added().form);
      await userForm.typeInto('Date Of Birth', '1984-06-02');

      await userForm.clear('Date Of Birth');

      expect(userForm.field('Date Of Birth')).toHaveValue('');
      expect(userForm.field('Date Of Birth')).not.toBeValid();
    });

    describe('for a zip code', () => {
      const homeZip = (): HTMLElement => userForm.addressField('home', 'Postal / Zip code');

      test('a letter in the zip leaves it invalid', async () => {
        render(added().form);

        await userForm.typeIntoAddress('home', 'Postal / Zip code', 'a');

        expect(homeZip()).toHaveDisplayValue('a');
        expect(homeZip()).not.toBeValid();
      });

      test('one digit is not yet a zip', async () => {
        render(added().form);

        await userForm.typeIntoAddress('home', 'Postal / Zip code', '1');

        expect(homeZip()).toHaveDisplayValue('1');
        expect(homeZip()).not.toBeValid();
      });

      test('five digits are a zip', async () => {
        render(added().form);

        await userForm.typeIntoAddress('home', 'Postal / Zip code', '60012');

        expect(homeZip()).toHaveDisplayValue('60012');
        expect(homeZip()).toBeValid();
      });

      test('five digits, a dash and four more are a zip', async () => {
        render(added().form);

        await userForm.typeIntoAddress('home', 'Postal / Zip code', '12345-1234');

        expect(homeZip()).toHaveDisplayValue('12345-1234');
        expect(homeZip()).toBeValid();
      });

    });
  });
});

describe('the first face', () => {
  test('a new form opens on the same face every time, so the page drawn at build time shows the face the form holds', () => {
    const {unmount} = render(added().form);
    const opened = userForm.avatarShown();
    unmount();

    render(added().form);

    expect(userForm.avatarShown()).toEqual(opened);
  });
});

describe('the avatar control plays fair with the keyboard', () => {
  test('enter draws a new avatar, like a click does', async () => {
    render(added().form);
    const before = userForm.avatarShown();

    await userForm.drawAvatarByKey('{enter}');

    expect(userForm.avatarShown()).not.toEqual(before);
  });

  test('space draws a new avatar, like a click does', async () => {
    render(added().form);
    const before = userForm.avatarShown();

    await userForm.drawAvatarByKey(' ');

    expect(userForm.avatarShown()).not.toEqual(before);
  });

  test('every new avatar is announced', async () => {
    render(added().form);
    expect(userForm.avatarReport()).toBeEmptyDOMElement();

    await userForm.drawAvatar();
    expect(userForm.avatarReport()).toHaveTextContent('1 new avatar drawn.');

    await userForm.drawAvatar();
    expect(userForm.avatarReport()).toHaveTextContent('2 new avatars drawn.');
  });
});

describe('the keyboard walks the whole form', () => {
  test('tab visits each control once and always gets out the other side', async () => {
    render(added().form);
    const {visited, escaped} = await userForm.tabbedFromFirstName();

    expect(new Set(visited).size, 'tab revisited a control, a trap').toBe(visited.length);
    expect(escaped, 'tab never escaped the form').toBe(true);
    expect(visited.length).toBeGreaterThanOrEqual(10);
  });
});

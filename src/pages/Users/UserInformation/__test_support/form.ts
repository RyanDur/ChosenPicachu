import {screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Address, NewUser, User} from '../../profile';
import {format} from 'date-fns';
import {has} from '@ryandur/sand';

const swiftKeys = userEvent.setup({delay: null});

const form = (): HTMLElement => screen.getByRole('form', {name: 'User Information'});

const address = (kind: string) =>
  within(screen.getByRole('group', {name: new RegExp(`^${kind} address$`, 'i')}));

const paste = (field: HTMLElement, text: string): Promise<void> =>
  swiftKeys.click(field).then(() => swiftKeys.paste(text));

const pasteIfGiven = (field: HTMLElement, text?: string): Promise<void> =>
  has(text) ? paste(field, text) : Promise.resolve();

const fillOutAddress = (given: Address, kind: string): Promise<void> =>
  paste(address(kind).getByLabelText('Street'), given.streetAddress)
    .then(() => pasteIfGiven(address(kind).getByLabelText('Street Line 2'), given.streetAddressTwo))
    .then(() => paste(address(kind).getByLabelText('City'), given.city))
    .then(() => swiftKeys.selectOptions(address(kind).getByLabelText('State'), given.state))
    .then(() => paste(address(kind).getByLabelText('Postal / Zip code'), given.zip));

const fillOutPerson = ({person}: Pick<NewUser, 'person'>): Promise<void> =>
  paste(screen.getByLabelText('First Name'), person.firstName)
    .then(() => paste(screen.getByLabelText('Last Name'), person.lastName))
    .then(() => paste(screen.getByLabelText('Email'), person.email))
    .then(() => swiftKeys.type(screen.getByLabelText('Date Of Birth'), format(person.dateOfBirth!, 'yyyy-MM-dd')));

const field = (label: string): HTMLElement => within(form()).getByLabelText(label);

const addressField = (kind: string, label: string): HTMLElement => address(kind).getByLabelText(label);

const sameAsHome = (): HTMLElement => screen.getByRole('checkbox', {name: 'Same as Home'});

export const userForm = {
  addressField,
  field,
  sameAsHome,

  showing: (user: User): Promise<HTMLElement> => waitFor(() => within(form()).getByDisplayValue(user.person.firstName)),

  avatar: (): HTMLElement => screen.getByRole('button', {name: 'Draw a new avatar'}),

  avatarShown: (): string => screen.getByAltText<HTMLImageElement>('avatar').src,

  avatarReport: (): HTMLElement => screen.getByRole('status', {name: 'avatar report'}),

  drawAvatar: (): Promise<void> => userEvent.click(screen.getByRole('button', {name: 'Draw a new avatar'})),

  drawAvatarByKey: async (key: string): Promise<void> => {
    screen.getByRole('button', {name: 'Draw a new avatar'}).focus();
    await userEvent.keyboard(key);
  },

  sameAsHomeInWorkAddress: (): HTMLElement =>
    within(screen.getByRole('group', {name: 'Work Address'})).getByRole('checkbox', {name: 'Same as Home'}),

  typeDetails: (text: string): Promise<void> => userEvent.type(field('Details'), text),

  typeIntoAddress: (kind: string, label: string, text: string): Promise<void> =>
    userEvent.type(addressField(kind, label), text),

  clear: (label: string): Promise<void> => userEvent.clear(field(label)),

  tabbedFromFirstName: async (): Promise<{visited: Element[]; escaped: boolean}> => {
    await userEvent.click(field('First Name'));
    const visited: Element[] = [];
    while (document.activeElement && form().contains(document.activeElement) && visited.length < 50) {
      const revisited = visited.includes(document.activeElement);
      visited.push(document.activeElement);
      if (revisited) break;
      await userEvent.tab();
    }
    return {visited, escaped: !form().contains(document.activeElement)};
  },

  editLink: (): HTMLElement => within(form()).getByRole('link', {name: 'Edit'}),

  typeInto: (label: string, text: string): Promise<void> => userEvent.type(field(label), text),

  tickSameAsHome: (): Promise<void> => userEvent.click(sameAsHome()),

  reset: (): Promise<void> => userEvent.click(within(form()).getByRole('button', {name: 'Reset'})),

  cancel: (): Promise<void> => userEvent.click(within(form()).getByRole('link', {name: 'Cancel'})),

  fillOut: (user: Pick<NewUser, 'person' | 'homeAddress'> & {work: Address}): Promise<void> =>
    fillOutPerson(user)
      .then(() => fillOutAddress(user.homeAddress, 'home'))
      .then(() => fillOutAddress(user.work, 'work')),

  addWhoWorksFromHome: async (user: User): Promise<void> => {
    await fillOutPerson(user);
    await fillOutAddress(user.homeAddress, 'home');
    await swiftKeys.click(sameAsHome());
    if (has(user.details)) await swiftKeys.type(screen.getByLabelText('Details'), user.details);
    await swiftKeys.click(await within(form()).findByRole('button', {name: 'Add'}));
  },

  addButton: (): HTMLElement => within(form()).getByRole('button', {name: 'Add'}),
  updateButtonIfAny: (): HTMLElement | null => screen.queryByRole('button', {name: 'Update'}),

  add: (): Promise<void> => userEvent.click(within(form()).getByRole('button', {name: 'Add'})),

  update: (): Promise<void> => swiftKeys.click(within(form()).getByRole('button', {name: 'Update'}))
};

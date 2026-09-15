import {screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {AddressInfo, NewUser, User} from '@components/Users/UserInfo/user';
import {format} from 'date-fns';

const swiftKeys = userEvent.setup({delay: null});

const form = (): HTMLElement => screen.getByRole('form', {name: 'User Information'});

const address = (kind: string) =>
  within(screen.getByRole('group', {name: new RegExp(`^${kind} address$`, 'i')}));

const paste = (field: HTMLElement, text: string): Promise<void> =>
  swiftKeys.click(field).then(() => swiftKeys.paste(text));

const pasteIfGiven = (field: HTMLElement, text?: string): Promise<void> =>
  text === undefined ? Promise.resolve() : paste(field, text);

const fillOutAddress = (given: AddressInfo, kind: string): Promise<void> =>
  paste(address(kind).getByLabelText('Street'), given.streetAddress)
    .then(() => pasteIfGiven(address(kind).getByLabelText('Street Line 2'), given.streetAddressTwo))
    .then(() => paste(address(kind).getByLabelText('City'), given.city))
    .then(() => swiftKeys.selectOptions(address(kind).getByLabelText('State'), given.state))
    .then(() => paste(address(kind).getByLabelText('Postal / Zip code'), given.zip));

const fillOutPerson = ({info}: Pick<NewUser, 'info'>): Promise<void> =>
  paste(screen.getByLabelText('First Name'), info.firstName)
    .then(() => paste(screen.getByLabelText('Last Name'), info.lastName))
    .then(() => paste(screen.getByLabelText('Email'), info.email))
    .then(() => swiftKeys.type(screen.getByLabelText('Date Of Birth'), format(info.dob!, 'yyyy-MM-dd')));

const field = (label: string): HTMLElement => within(form()).getByLabelText(label);

const sameAsHome = (): HTMLElement => screen.getByRole('checkbox', {name: 'Same as Home'});

export const userForm = {
  address,
  field,
  sameAsHome,

  showing: (user: User): Promise<HTMLElement> => waitFor(() => within(form()).getByDisplayValue(user.info.firstName)),

  avatar: (): HTMLElement => screen.getByRole('button', {name: 'Draw a new avatar'}),

  avatarShown: (): string => screen.getByAltText<HTMLImageElement>('avatar').src,

  editLink: (): HTMLElement => within(form()).getByRole('link', {name: 'Edit'}),

  typeInto: (label: string, text: string): Promise<void> => userEvent.type(field(label), text),

  tickSameAsHome: (): Promise<void> => userEvent.click(sameAsHome()),

  reset: (): Promise<void> => userEvent.click(within(form()).getByRole('button', {name: 'Reset'})),

  cancel: (): Promise<void> => userEvent.click(within(form()).getByRole('link', {name: 'Cancel'})),

  fillOut: (user: Pick<NewUser, 'info' | 'homeAddress'> & {work: AddressInfo}): Promise<void> =>
    fillOutPerson(user)
      .then(() => fillOutAddress(user.homeAddress, 'home'))
      .then(() => fillOutAddress(user.work, 'work')),

  addWhoWorksFromHome: async (user: User): Promise<void> => {
    await fillOutPerson(user);
    await fillOutAddress(user.homeAddress, 'home');
    await swiftKeys.click(sameAsHome());
    if (user.details !== undefined) await swiftKeys.type(screen.getByLabelText('Details'), user.details);
    await swiftKeys.click(await within(form()).findByRole('button', {name: 'Add'}));
  },

  add: (): Promise<void> => userEvent.click(within(form()).getByRole('button', {name: 'Add'})),

  update: (): Promise<void> => swiftKeys.click(within(form()).getByRole('button', {name: 'Update'}))
};

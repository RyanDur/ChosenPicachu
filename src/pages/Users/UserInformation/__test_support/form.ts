import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {AddressInfo, NewUser} from '@components/Users/UserInfo/user';
import {format} from 'date-fns';

const swiftKeys = userEvent.setup({delay: null});

export const addressGroup = (kind: string) =>
  within(screen.getByRole('article', {name: new RegExp(`${kind} address`, 'i')}));

const paste = (field: HTMLElement, text: string): Promise<void> =>
  swiftKeys.click(field).then(() => swiftKeys.paste(text));

const pasteIfGiven = (field: HTMLElement, text?: string): Promise<void> =>
  text === undefined ? Promise.resolve() : paste(field, text);

export const fillOutAddress = (address: AddressInfo, kind: string) =>
  paste(addressGroup(kind).getByLabelText('Street'), address.streetAddress)
    .then(() => pasteIfGiven(addressGroup(kind).getByLabelText('Street Line 2'), address.streetAddressTwo))
    .then(() => paste(addressGroup(kind).getByLabelText('City'), address.city))
    .then(() => swiftKeys.selectOptions(addressGroup(kind).getByLabelText('State'), address.state))
    .then(() => paste(addressGroup(kind).getByLabelText('Postal / Zip code'), address.zip));

export const fillOutUser = (info: Pick<NewUser, 'info'>) =>
  paste(screen.getByLabelText('First Name'), info.info.firstName)
    .then(() => paste(screen.getByLabelText('Last Name'), info.info.lastName))
    .then(() => paste(screen.getByLabelText('Email'), info.info.email))
    .then(() => swiftKeys.type(screen.getByLabelText('Date Of Birth'), format(info.info.dob!, 'yyyy-MM-dd')));

export const fillOutForm = (info: Pick<NewUser, 'info' | 'homeAddress'> & {work: AddressInfo}) =>
  fillOutUser(info)
    .then(() => fillOutAddress(info.homeAddress, 'home'))
    .then(() => fillOutAddress(info.work, 'work'));

import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {AddressInfo, NewUser} from '@components/Users/UserInfo/types';
import {format} from 'date-fns';

const swiftKeys = userEvent.setup({delay: null});

export const addressGroup = (kind: string) =>
  within(screen.getByRole('article', {name: new RegExp(`${kind} address`, 'i')}));

export const fillOutAddress = (address: AddressInfo, kind: string) =>
  swiftKeys.type(addressGroup(kind).getByLabelText('Street'), address.streetAddress)
    .then(() => swiftKeys.type(addressGroup(kind).getByLabelText('Street Line 2'), address.streetAddressTwo!))
    .then(() => swiftKeys.type(addressGroup(kind).getByLabelText('City'), address.city))
    .then(() => swiftKeys.selectOptions(addressGroup(kind).getByLabelText('State'), address.state))
    .then(() => swiftKeys.type(addressGroup(kind).getByLabelText('Postal / Zip code'), address.zip));

export const fillOutUser = (info: NewUser) =>
  swiftKeys.type(screen.getByLabelText('First Name'), info.info.firstName)
    .then(() => swiftKeys.type(screen.getByLabelText('Last Name'), info.info.lastName))
    .then(() => swiftKeys.type(screen.getByLabelText('Email'), info.info.email!))
    .then(() => swiftKeys.type(screen.getByLabelText('Date Of Birth'), format(info.info.dob!, 'yyyy-MM-dd')));

export const fillOutForm = (info: NewUser) =>
  fillOutUser(info)
    .then(() => fillOutAddress(info.homeAddress, 'home'))
    .then(() => fillOutAddress(info.workAddress!, 'work'));

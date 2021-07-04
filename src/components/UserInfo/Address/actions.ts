import {Action} from '../types';

export enum AddressActions {
    UPDATE_STREET_ADDRESS = 'streetAddress',
    UPDATE_STREET_ADDRESS_2 = 'streetAddress2',
    UPDATE_CITY = 'city',
    UPDATE_STATE = 'state',
    UPDATE_ZIP = 'zip'
}

type UpdateStreetAddress = Action<AddressActions.UPDATE_STREET_ADDRESS> & {
    streetAddress: string;
}

type UpdateStreetAddress2 = Action<AddressActions.UPDATE_STREET_ADDRESS_2> & {
    streetAddressTwo: string;
}

type UpdateCity = Action<AddressActions.UPDATE_CITY> & {
    city: string;
}

type UpdateState = Action<AddressActions.UPDATE_STATE> & {
    state: string;
}

type UpdateZip = Action<AddressActions.UPDATE_ZIP> & {
    zip: string;
}

export type AddressAction = UpdateStreetAddress | UpdateStreetAddress2 | UpdateCity | UpdateState | UpdateZip
import {AddressInfo} from '../types';
import {AddressAction, AddressActions} from './actions';

export const addressReducer = (address: Partial<AddressInfo>, action: AddressAction): Partial<AddressInfo> => {
    switch (action.type) {
        case AddressActions.UPDATE_STREET_ADDRESS:
            return {...address, streetAddress: action.streetAddress};
        case AddressActions.UPDATE_STREET_ADDRESS_2:
            return {...address, streetAddressTwo: action.streetAddressTwo};
        case AddressActions.UPDATE_CITY:
            return {...address, city: action.city};
        case AddressActions.UPDATE_STATE:
            return {...address, state: action.state};
        case AddressActions.UPDATE_ZIP:
            return {...address, zip: action.zip};
    }
    return address;
};

import {AddressInfo} from '@components/Users';

const addressKeys: (keyof AddressInfo)[] = ['streetAddress', 'streetAddressTwo', 'city', 'state', 'zip'];

export const equalAddresses = (address1: AddressInfo, address2?: AddressInfo): boolean =>
  addressKeys.every(key => address1[key] === address2?.[key]);

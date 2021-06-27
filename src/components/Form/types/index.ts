export interface AddressInfo {
    streetAddress: string;
    streetAddressTwo?: string;
    city: string;
    state: string;
    zip: string;
}

export interface User {
    firstName: string;
    lastName: string;
}

export interface UserInfo {
    user: User;
    homeAddress: AddressInfo;
    workAddress?: AddressInfo;
    details?: string;
}

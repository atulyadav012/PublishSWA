export interface AddressRequest {
    userMasterId: Number
    addressType: string;
    address1: string;
    address2: string;
    countryCode: string;
    stateMasterId: Number;
    cityMasterId: Number;
    countyMasterId: Number;
    zipCode: string;
    isPrimary: Boolean;

}

export class AddressParams {
    userMasterId: Number
    addressType: string;
    address1: string;
    address2: string;
    countryCode: string;
    stateMasterId: Number;
    cityMasterId: Number;
    countyMasterId: Number;
    zipCode: string;
    isPrimary: Boolean;

}
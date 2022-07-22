export interface User {

    FirstName: string;
    LastName: string;
    LoginId: string;
    Password: string;
    ParentUserId?: Number;
    RoleName: string;
    ProfileType: string;
}

export interface Login {
    LoginId: string;
    Password: string;
}

export interface LoginResponse {
    errorMessage: string;
    isSuccess: Boolean
    message: string;
    model: UserModel
}
export interface UserModel {
    id?: Number;
    username?: string;
    token?: string;
    firstName?: string;
    lastName?: string;
    profileType?: string;
    barDetails?: Array<barDetails>;
    practiceAreas?: Array<practiceAreas>;
    profileDetails?: Array<profileDetails>;
    recordStatus?: string;
    parentUserId?: Number;
    modifiedById?: Number;
    avgRatingAsAtt?:number;
    avgRatingAsEmp?: number;
    practiceAreaIds?:Array<number>;
    stateIds?:Array<number>;
    //Code added by atul on 8 apr 22 for fix bug 445 Subuser is not asked to complete profile (Mobile no which is mandatory field) on first login or after that
    mobileNo?: string; 
    //Code added by atul on 13 may 22 for making stripe mandatory
    isStripeConnected?: boolean; 
}
export interface barDetails {
    autoId: number,
    barNo: string,
    isPrimary: boolean,
    recordStatus: string,
    stateMasterId: number,
    stateName: string,
    userMasterId: number
}

export interface practiceAreas {
    autoId: number,
    briefDescription: string,
    practiceArea: string,
    practiceAreaId: number,
    recordStatus: string,
    userMasterId: number
}

export interface profileDetails {
    autoId: number,
    briefDescription: string,
    briefResume: string,
    expYears: number,
    generalAvailibility: string,
    generalAvailibilityDays: string,
    generalAvailibilityNotes: string
    hourlyRateMax: number
    hourlyRateMin: number
    rateNegotiable: boolean
    recordStatus: string
    resumePath: string
    travelDistance: number
    userMasterId: number
}
export interface UsergeneralInfo {
    autoId: Number,
    userMasterId: Number,
    firmName: string,
    firstName: string,
    middleName: string,
    lastName: string,
    mobileNo: string,
    businessNo: string,
    alternateEmail: string,
    website: string,
    profileImagePath: string,
    recordStatus: string,
    createdById: Number,
    createdDate: Date,
    createdIp: string,
    modifiedById: Number,
    modifiedDate: string,
    modifiedIp: string,
    userMaster: null
}

export interface UserGenProfileRequest {
    addressType: string,
    address1: string,
    address2: string,
    countryCode: Number,
    stateMasterId: Number,
    cityMasterId: Number,
    countyMasterId: Number,
    zipCode: string,
    isPrimary: boolean
}

export interface UpdateProfileRequest {

    userMasterId: Number;
    firmName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    MobileNo: string;
    BusinessNo: string;
    alternateEmail: string;
    website: string;
    profileImagePath: string;
    profileType: string;
}

export class UserBars {
    userMasterId: Number;
    stateMasterId: number;
    barNo: string;
    isPrimary: Boolean;
    stateName: string;
}

export interface AddUserBarsRequest {
    userMasterId: number,
    stateMasterId: number,
    barNo: string,
    isPrimary: Boolean
}

export class UserPracticeArea {
    userMasterId: Number;
    practiceAreaId: number;
    briefDescription: string;
    practiceArea: string;
}

export class UserProfileDetail {
    userMasterId: number;
    expYears: number;
    hourlyRate: number
    rateNegotiable: Boolean;
    travelDistance: number;
    generalAvailibility: string;
    generalAvailibilityNotes: string;
    briefResume: string;
    resumePath: string;
    briefDescription: string;
}

export class VerifyEmailModel {
    auto_Id: number;
    recordStatus: string;
}

export class Resendverification {
    userEmailId: string;
}

export class ChangePasswordModel {
    userEmailId: string;
    currentPassword: string;
    newPassword: string;
    isTempPassword: boolean;
}

export class forgetPassword {
    userEmailId: string;
}


export class UserSettingDTO {
    UserMasterId: number|Number;
    SettingCode: string;
    IsEnabled: boolean;
}

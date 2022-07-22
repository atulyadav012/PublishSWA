export class Appearance {

    userMasterId: number;
    caseTypeId: number
    appearanceTypeId: number;
    caseNo: string;
    countryCode: string;
    stateMasterId: number;
    cityMasterId: number;
    countyMasterId: number;
    courtHouseId: number;
    appearanceDateTime: Date;
    minRate: number;
    maxRate: number;
    caseTitle: string;
    minExp: number;
    description: string;
    notes: string;
    appearanceDocs: Array<AppearanceDoc>;
    appearanceLanguages: Array<AppearanceLanguages>;
    files: any;
}

export interface AppearanceDoc {
    appearanceId: number;
    documentPath: string;
}

export interface AppearanceLanguages {
    appearanceId: number;
    language: string;
}

export interface Appearancelist {
    userMasterId: number;
    practiceArea: string;
    caseTypeDescription: string;
    appearanceType: string;
    apperanceTypeDescription: string;
    countryName: string;
    stateName: string;
    countyName: string;
    cityName: string;
    courtName: string;
    caseNo: string;
    appearanceDateTime: string;
    minRate: number;
    maxRate: number;
    caseTitle: string;
    minExp: number;
    description: string;
    notes: string;
    appearanceDocs: string;
    appearanceLanguages: Array<string>;
    autoId: number;
    recordStatus: string
}

export interface CancelAppearance {
    userMasterId: Number,
    reasons: string,
    remarks: string

}

export interface ReOpen {
    remarks: string,
    userMasterId: Number
}

export interface BidAppearance {

    appearanceId: number,
    attorneyId?: Number,
    bidAmount: number,
    message: string

}

export interface CompleteAppearance {
    attorneyId: Number,
    message: string
}

export interface SearchLog {
    userMasterId: Number,
    searchFor: string,
    stateMasterId: string,
    caseTypePracticeAreaId: string,
    resultCount: number
  }
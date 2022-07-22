export interface StateMaster {
    countryCode: string;
    stateCode: string;
    stateName: string;
    autoId: number;
}

export interface StateMasterList {
    state: Array<StateMaster>;
}
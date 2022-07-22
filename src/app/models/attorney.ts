export interface attorney {
    appearanceId: number[],
    attorneyId: number[],
    invitedAppliedId?: Number,
    message: string
}

export interface attorneyreject {
    appearanceId: number,
    attorneyId: Number,
    message: string
}

export interface approveattorney {
    appearanceId: number,
    attorneyId: number,
    approvedById: Number,
    message: string
}

export interface Withdraw {
    appearanceId: number,
    attorneyId: Number,
    message: string
}

export class InviteAttorney {
    appearanceId: number[];
    attorneyId: number[];
    invitedAppliedId?: Number;
    message: string;
}
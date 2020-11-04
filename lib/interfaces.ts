
export enum Reasons {
    work = 'work',
    buy = 'buy',
    health = 'health',
    family = 'family',
    handicap = 'handicap',
    sport = 'sport',
    legal = 'legal',
    mission = 'mission',
    child = 'child'
}
;

export interface Profile {
    firstName: string;
    lastName: string;
    birthday: Date;
    placeOfBirth: string;
    address: string;
    city: string;
    postalCode: string;
}

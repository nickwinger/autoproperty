/// <reference path="../../typings/jasmine.d.ts" />
/// <reference path="../../node_modules/moment/moment.d.ts" />
import { NotifyPropertyChanged } from '../../src/autoproperty';
import moment = require('moment');
export declare enum IPassengerType {
    ADULT,
    YOUNGSTER,
    CHILD,
    DOG,
    BIKE,
    SCHOOLGROUP,
    BENEFITED,
}
export declare class Passenger extends NotifyPropertyChanged {
    id: number;
    kdbId: number;
    type: IPassengerType;
    colorId: string;
    birthDate: moment.Moment;
    fakeBirthDate: boolean;
    sex: string;
    firstName: string;
    lastName: string;
    me: boolean;
    remembered: boolean;
    challengedFlags: ChallengedFlags;
    relations: PassengerRelation[];
    cards: PassengerCard[];
    position: number;
    note1: string;
    note2: string;
    schoolcardGroup: SchoolcardGroup;
    atFbgType: number;
    atFbgPassengerIndex: number;
    constructor();
}
export declare class PassengerCollection extends NotifyPropertyChanged {
    passengers: Passenger[];
    constructor(passengers?: Passenger[]);
}
export declare class PassengerManager extends PassengerCollection {
    store: PassengerCollection;
    constructor();
}
export declare class ChallengedFlags extends NotifyPropertyChanged {
    hasHandicappedPass: boolean;
    hasAssistanceDog: boolean;
    hasWheelchair: boolean;
    hasAttendant: boolean;
    constructor();
}
export declare enum IPassengerRelationType {
    HAS_CHILD,
    HAS_ASSISTDOG,
    HAS_ATTENDANT,
}
export declare class PassengerRelation {
    otherPassenger: number;
    type: IPassengerRelationType;
    constructor(otherPassenger?: number, type?: IPassengerRelationType);
}
export declare class PassengerCard {
    cardNumber: string;
    customerId: string;
}
export declare class SchoolcardGroup extends NotifyPropertyChanged {
    groupSize: number;
    maxAttendants: number;
}

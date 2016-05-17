///<reference path="../../typings/jasmine.d.ts"/>
///<reference path="../../node_modules/moment/moment.d.ts"/>
import {autoproperty, NotifyPropertyChanged, PropertyChangedEventArgs, PropertyChangedEventArgsGeneric} from '../../src/autoproperty';
import moment = require('moment');

export enum IPassengerType {
    ADULT       = <any>"ADULT",
    YOUNGSTER   = <any>"YOUNGSTER",
    CHILD       = <any>"CHILD",
    DOG         = <any>"DOG",
    BIKE        = <any>"BIKE",
    SCHOOLGROUP = <any>"SCHOOL_GROUP",
    BENEFITED   = <any>"BENEFITED"
}

export class Passenger extends NotifyPropertyChanged {
    @autoproperty id: number;
    @autoproperty kdbId: number;
    @autoproperty type: IPassengerType;
    @autoproperty colorId: string;
    @autoproperty birthDate: moment.Moment;
    @autoproperty fakeBirthDate:boolean;
    @autoproperty sex:string;
    @autoproperty firstName:string;
    @autoproperty lastName:string;
    @autoproperty me:boolean;
    @autoproperty remembered:boolean;
    @autoproperty challengedFlags:ChallengedFlags;
    @autoproperty relations:PassengerRelation[];
    @autoproperty cards:PassengerCard[];
    @autoproperty position:number;
    @autoproperty note1:string;
    @autoproperty note2:string;
    @autoproperty schoolcardGroup:SchoolcardGroup;
    @autoproperty atFbgType:number;
    @autoproperty atFbgPassengerIndex:number;

    constructor() {
        super();

        this.birthDate = moment("20160101", "YYYYMMDD");
        this.type = IPassengerType.ADULT;
        this.challengedFlags = new ChallengedFlags();
    }
}

export class ChallengedFlags extends NotifyPropertyChanged {
    @autoproperty hasHandicappedPass:boolean;
    @autoproperty hasAssistanceDog:boolean;
    @autoproperty hasWheelchair:boolean;
    @autoproperty hasAttendant:boolean;

    constructor() {
        super();

        this.hasAssistanceDog = false;
        this.hasHandicappedPass = false;
        this.hasWheelchair = false;
        this.hasAttendant = false;
    }
}

export enum IPassengerRelationType {
    HAS_CHILD     = <any>"HAS_CHILD",
    HAS_ASSISTDOG = <any>"HAS_ASSISTDOG",
    HAS_ATTENDANT = <any>"HAS_ATTENDANT"
}

export class PassengerRelation {

    constructor(public otherPassenger?:number, public type?:IPassengerRelationType) {
    }
}

export class PassengerCard {
    cardNumber:string;
    customerId:string;
}

export class SchoolcardGroup extends NotifyPropertyChanged {
    @autoproperty groupSize:number;
    @autoproperty maxAttendants:number;
}

describe('propertyChanged', () => {
    it('should fire and reflect changes on complex Models -> moment', (done) => {
        var p = new Passenger();

        var subscription = p.propertyChanged.subscribe((args: PropertyChangedEventArgs) => {
            expect(args.propertyName).toBe('birthDate');
            expect(args.oldValue.format("YYYYMMDD")).toBe("20160101");
            expect(args.newValue.format("YYYYMMDD")).toBe("20160102");

            subscription.unsubscribe();
            done();
        });

        p.birthDate = moment("20160102", "YYYYMMDD");
    });

    it('should fire and reflect changes on complex Models -> enum', (done) => {
        var p = new Passenger();

        var subscription = p.propertyChanged.subscribe((args: PropertyChangedEventArgs) => {
            expect(args.propertyName).toBe('type');
            expect(args.oldValue).toBe(IPassengerType.ADULT);
            expect(args.newValue).toBe(IPassengerType.BENEFITED);

            subscription.unsubscribe();
            done();
        });

        p.type = IPassengerType.BENEFITED;
    });

    it('should fire and reflect changes on complex Models -> subModel change', (done) => {
        var p = new Passenger();

        var subscription = p.propertyChanged.subscribe((args: PropertyChangedEventArgs) => {
            expect(args.propertyName).toBe('challengedFlags.hasAssistanceDog');
            expect(args.oldValue).toBe(false);
            expect(args.newValue).toBe(true);

            subscription.unsubscribe();
            done();
        });

        p.challengedFlags.hasAssistanceDog = true;
    });
});
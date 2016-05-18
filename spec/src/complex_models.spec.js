"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var autoproperty_1 = require('../../src/autoproperty');
var moment = require('moment');
(function (IPassengerType) {
    IPassengerType[IPassengerType["ADULT"] = "ADULT"] = "ADULT";
    IPassengerType[IPassengerType["YOUNGSTER"] = "YOUNGSTER"] = "YOUNGSTER";
    IPassengerType[IPassengerType["CHILD"] = "CHILD"] = "CHILD";
    IPassengerType[IPassengerType["DOG"] = "DOG"] = "DOG";
    IPassengerType[IPassengerType["BIKE"] = "BIKE"] = "BIKE";
    IPassengerType[IPassengerType["SCHOOLGROUP"] = "SCHOOL_GROUP"] = "SCHOOLGROUP";
    IPassengerType[IPassengerType["BENEFITED"] = "BENEFITED"] = "BENEFITED";
})(exports.IPassengerType || (exports.IPassengerType = {}));
var IPassengerType = exports.IPassengerType;
var Passenger = (function (_super) {
    __extends(Passenger, _super);
    function Passenger() {
        _super.call(this);
        this.birthDate = moment("20160101", "YYYYMMDD");
        this.type = IPassengerType.ADULT;
        this.challengedFlags = new ChallengedFlags();
    }
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Number)
    ], Passenger.prototype, "id", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Number)
    ], Passenger.prototype, "kdbId", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Number)
    ], Passenger.prototype, "type", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', String)
    ], Passenger.prototype, "colorId", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Object)
    ], Passenger.prototype, "birthDate", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Boolean)
    ], Passenger.prototype, "fakeBirthDate", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', String)
    ], Passenger.prototype, "sex", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', String)
    ], Passenger.prototype, "firstName", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', String)
    ], Passenger.prototype, "lastName", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Boolean)
    ], Passenger.prototype, "me", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Boolean)
    ], Passenger.prototype, "remembered", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', ChallengedFlags)
    ], Passenger.prototype, "challengedFlags", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Array)
    ], Passenger.prototype, "relations", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Array)
    ], Passenger.prototype, "cards", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Number)
    ], Passenger.prototype, "position", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', String)
    ], Passenger.prototype, "note1", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', String)
    ], Passenger.prototype, "note2", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', SchoolcardGroup)
    ], Passenger.prototype, "schoolcardGroup", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Number)
    ], Passenger.prototype, "atFbgType", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Number)
    ], Passenger.prototype, "atFbgPassengerIndex", void 0);
    return Passenger;
}(autoproperty_1.NotifyPropertyChanged));
exports.Passenger = Passenger;
var PassengerCollection = (function (_super) {
    __extends(PassengerCollection, _super);
    function PassengerCollection(passengers) {
        if (passengers === void 0) { passengers = []; }
        _super.call(this);
        this.passengers = passengers;
    }
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Array)
    ], PassengerCollection.prototype, "passengers", void 0);
    return PassengerCollection;
}(autoproperty_1.NotifyPropertyChanged));
exports.PassengerCollection = PassengerCollection;
var PassengerManager = (function (_super) {
    __extends(PassengerManager, _super);
    function PassengerManager() {
        _super.call(this);
        this.store = new PassengerCollection();
    }
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', PassengerCollection)
    ], PassengerManager.prototype, "store", void 0);
    return PassengerManager;
}(PassengerCollection));
exports.PassengerManager = PassengerManager;
var ChallengedFlags = (function (_super) {
    __extends(ChallengedFlags, _super);
    function ChallengedFlags() {
        _super.call(this);
        this.hasAssistanceDog = false;
        this.hasHandicappedPass = false;
        this.hasWheelchair = false;
        this.hasAttendant = false;
    }
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Boolean)
    ], ChallengedFlags.prototype, "hasHandicappedPass", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Boolean)
    ], ChallengedFlags.prototype, "hasAssistanceDog", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Boolean)
    ], ChallengedFlags.prototype, "hasWheelchair", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Boolean)
    ], ChallengedFlags.prototype, "hasAttendant", void 0);
    return ChallengedFlags;
}(autoproperty_1.NotifyPropertyChanged));
exports.ChallengedFlags = ChallengedFlags;
(function (IPassengerRelationType) {
    IPassengerRelationType[IPassengerRelationType["HAS_CHILD"] = "HAS_CHILD"] = "HAS_CHILD";
    IPassengerRelationType[IPassengerRelationType["HAS_ASSISTDOG"] = "HAS_ASSISTDOG"] = "HAS_ASSISTDOG";
    IPassengerRelationType[IPassengerRelationType["HAS_ATTENDANT"] = "HAS_ATTENDANT"] = "HAS_ATTENDANT";
})(exports.IPassengerRelationType || (exports.IPassengerRelationType = {}));
var IPassengerRelationType = exports.IPassengerRelationType;
var PassengerRelation = (function () {
    function PassengerRelation(otherPassenger, type) {
        this.otherPassenger = otherPassenger;
        this.type = type;
    }
    return PassengerRelation;
}());
exports.PassengerRelation = PassengerRelation;
var PassengerCard = (function () {
    function PassengerCard() {
    }
    return PassengerCard;
}());
exports.PassengerCard = PassengerCard;
var SchoolcardGroup = (function (_super) {
    __extends(SchoolcardGroup, _super);
    function SchoolcardGroup() {
        _super.apply(this, arguments);
    }
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Number)
    ], SchoolcardGroup.prototype, "groupSize", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Number)
    ], SchoolcardGroup.prototype, "maxAttendants", void 0);
    return SchoolcardGroup;
}(autoproperty_1.NotifyPropertyChanged));
exports.SchoolcardGroup = SchoolcardGroup;
describe('propertyChanged', function () {
    it('should fire and reflect changes on complex Models -> moment', function (done) {
        var p = new Passenger();
        var subscription = p.$propertyChanged.subscribe(function (args) {
            expect(args.propertyName).toBe('birthDate');
            expect(args.oldValue.format("YYYYMMDD")).toBe("20160101");
            expect(args.newValue.format("YYYYMMDD")).toBe("20160102");
            subscription.unsubscribe();
            done();
        });
        p.birthDate = moment("20160102", "YYYYMMDD");
    });
    it('should fire and reflect changes on complex Models -> enum', function (done) {
        var p = new Passenger();
        var subscription = p.$propertyChanged.subscribe(function (args) {
            expect(args.propertyName).toBe('type');
            expect(args.oldValue).toBe(IPassengerType.ADULT);
            expect(args.newValue).toBe(IPassengerType.BENEFITED);
            subscription.unsubscribe();
            done();
        });
        p.type = IPassengerType.BENEFITED;
    });
    it('should fire and reflect changes on complex Models -> subModel change', function (done) {
        var p = new Passenger();
        var subscription = p.$propertyChanged.subscribe(function (args) {
            expect(args.propertyName).toBe('challengedFlags.hasAssistanceDog');
            expect(args.oldValue).toBe(false);
            expect(args.newValue).toBe(true);
            subscription.unsubscribe();
            done();
        });
        p.challengedFlags.hasAssistanceDog = true;
    });
    it('should fire and reflect changes on complex Models -> property of class inside array', function (done) {
        var man = new PassengerManager();
        var p = new Passenger();
        var p2 = new Passenger();
        var subscription = man.$propertyChanged.subscribe(function (args) {
            if (args.propertyName === 'store.passengers[0].challengedFlags.hasAssistanceDog') {
                subscription.unsubscribe();
                done();
            }
        });
        man.passengers.push(p);
        man.store.passengers.push(p2);
        p2.challengedFlags.hasAssistanceDog = true;
    });
});

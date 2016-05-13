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
var Car = (function (_super) {
    __extends(Car, _super);
    function Car(make) {
        _super.call(this);
        this.make = make;
    }
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', String)
    ], Car.prototype, "make", void 0);
    return Car;
}(autoproperty_1.NotifyPropertyChanged));
var Person = (function (_super) {
    __extends(Person, _super);
    function Person() {
        _super.call(this);
        this.name = 'Thomas';
        this.id = 15;
        this.newsletter = false;
        this.hobbies = ['Skiing'];
        this.car = new Car('Chevrolet');
    }
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', String)
    ], Person.prototype, "name", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Number)
    ], Person.prototype, "id", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Boolean)
    ], Person.prototype, "newsletter", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Car)
    ], Person.prototype, "car", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Array)
    ], Person.prototype, "hobbies", void 0);
    return Person;
}(autoproperty_1.NotifyPropertyChanged));
describe('propertyChanged', function () {
    it('should fire and reflect changes on strings', function () {
        var p = new Person();
        var subscription = p.propertyChanged.subscribe(function (args) {
            expect(args.propertyName).toBe('name');
            expect(args.oldValue).toBe('Thomas');
            expect(args.newValue).toBe('Helmut');
        });
        p.name = 'Helmut';
        subscription.unsubscribe();
    });
    it('should fire and reflect changes on numbers', function () {
        var p = new Person();
        var subscription = p.propertyChanged.subscribe(function (args) {
            expect(args.propertyName).toBe('id');
            expect(args.oldValue).toBe(15);
            expect(args.newValue).toBe(16);
        });
        p.id = 16;
        subscription.unsubscribe();
    });
    it('should fire and reflect changes on booleans', function () {
        var p = new Person();
        var subscription = p.propertyChanged.subscribe(function (args) {
            expect(args.propertyName).toBe('newsletter');
            expect(args.oldValue).toBe(false);
            expect(args.newValue).toBe(true);
        });
        p.newsletter = true;
        subscription.unsubscribe();
    });
    it('should fire and reflect changes on classes', function () {
        var p = new Person();
        var subscription = p.propertyChanged.subscribe(function (args) {
            expect(args.propertyName).toBe('car');
            expect(args.oldValue.make).toBe('Chevrolet');
            expect(args.newValue.make).toBe('Ford');
        });
        p.car = new Car('Ford');
        subscription.unsubscribe();
    });
    it('should fire and reflect changes on arrays', function () {
        var p = new Person();
        var subscription = p.propertyChanged.subscribe(function (args) {
            console.log('a', args);
            expect(args.propertyName).toBe('hobbies');
            expect(args.oldValue).toBe(['Skiing']);
            expect(args.newValue).toBe(['Skiing', 'Driving']);
        });
        p['_hobbies'].push('Driving');
        console.log('p', p['_hobbies']);
        subscription.unsubscribe();
    });
});

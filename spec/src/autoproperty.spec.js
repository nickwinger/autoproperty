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
var Child = (function (_super) {
    __extends(Child, _super);
    function Child() {
        _super.apply(this, arguments);
    }
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', String)
    ], Child.prototype, "name", void 0);
    return Child;
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
        this.secondCar = new Car('Toyota');
        this.child = new Child();
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
        __metadata('design:type', Car)
    ], Person.prototype, "secondCar", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Array)
    ], Person.prototype, "hobbies", void 0);
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Child)
    ], Person.prototype, "child", void 0);
    return Person;
}(autoproperty_1.NotifyPropertyChanged));
var Persons = (function (_super) {
    __extends(Persons, _super);
    function Persons() {
        _super.call(this);
        this.persons = [];
    }
    __decorate([
        autoproperty_1.autoproperty, 
        __metadata('design:type', Array)
    ], Persons.prototype, "persons", void 0);
    return Persons;
}(autoproperty_1.NotifyPropertyChanged));
describe('propertyChanged', function () {
    it('should fire and reflect changes on strings', function (done) {
        var p = new Person();
        var subscription = p.propertyChanged.subscribe(function (args) {
            expect(args.propertyName).toBe('name');
            expect(args.oldValue).toBe('Thomas');
            expect(args.newValue).toBe('Helmut');
            subscription.unsubscribe();
            done();
        });
        p.name = 'Helmut';
    });
    it('should fire and reflect changes on numbers', function (done) {
        var p = new Person();
        var subscription = p.propertyChanged.subscribe(function (args) {
            expect(args.propertyName).toBe('id');
            expect(args.oldValue).toBe(15);
            expect(args.newValue).toBe(16);
            subscription.unsubscribe();
            done();
        });
        p.id = 16;
    });
    it('should fire and reflect changes on booleans', function (done) {
        var p = new Person();
        var subscription = p.propertyChanged.subscribe(function (args) {
            expect(args.propertyName).toBe('newsletter');
            expect(args.oldValue).toBe(false);
            expect(args.newValue).toBe(true);
            subscription.unsubscribe();
            done();
        });
        p.newsletter = true;
    });
    it('should fire and reflect changes on classes', function (done) {
        var p = new Person();
        var subscription = p.propertyChanged.subscribe(function (args) {
            expect(args.propertyName).toBe('car');
            expect(args.oldValue.make).toBe('Chevrolet');
            expect(args.newValue.make).toBe('Ford');
            subscription.unsubscribe();
            done();
        });
        p.car = new Car('Ford');
    });
    it('should fire and reflect changes on arrays', function (done) {
        var p = new Person();
        var subscription = p.propertyChanged.subscribe(function (args) {
            expect(args.propertyName).toBe('hobbies');
            expect(args.oldValue.length).toBe(1);
            expect(args.oldValue[0]).toBe('Skiing');
            expect(args.newValue.length).toBe(2);
            expect(args.newValue[0]).toBe('Skiing');
            expect(args.newValue[1]).toBe('Driving');
            subscription.unsubscribe();
            done();
        });
        p.hobbies.push('Driving');
    });
    it('should fire and reflect changes on properties of child classes', function (done) {
        var p = new Person();
        var subscription = p.propertyChanged.subscribe(function (args) {
            expect(args.propertyName).toBe('child.name');
            expect(args.newValue).toBe('Florian');
            subscription.unsubscribe();
            done();
        });
        p.child.name = 'Florian';
    });
    it('should fire and reflect changes on classes inside an array', function (done) {
        var pArr = new Persons();
        var p = new Person();
        var subscription = pArr.propertyChanged.subscribe(function (args) {
            if (args.propertyName === 'persons[0].name') {
                expect(args.oldValue).toBe('Thomas');
                expect(args.newValue).toBe('Tarek');
                subscription.unsubscribe();
                done();
            }
        });
        pArr.persons.push(p);
        p.name = 'Tarek';
    });
    it('should fire and reflect changes on classes inside an array 2', function (done) {
        var pArr = new Persons();
        var p = new Person();
        var subscription = pArr.propertyChanged.subscribe(function (args) {
            if (args.propertyName === 'persons[1].name') {
                expect(args.oldValue).toBe('Tarek');
                expect(args.newValue).toBe('Hermine');
                subscription.unsubscribe();
                done();
            }
        });
        pArr.persons.push(p);
        p.name = 'Tarek';
        pArr.persons = [];
        pArr.persons.push(new Person());
        pArr.persons.push(p);
        p.name = 'Hermine';
    });
});

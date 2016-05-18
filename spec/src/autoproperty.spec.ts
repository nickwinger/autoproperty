///<reference path="../../typings/jasmine.d.ts"/>
import {autoproperty, NotifyPropertyChanged, PropertyChangedEventArgs, PropertyChangedEventArgsGeneric} from '../../src/autoproperty';

class Car extends NotifyPropertyChanged {
    @autoproperty
    make: string;
    
    constructor(make?: string) {
        super();
        
        this.make = make;
    }
}

class Child extends NotifyPropertyChanged {
    @autoproperty
    name: string;
}

class Person extends NotifyPropertyChanged {
    @autoproperty
    name: string = 'Thomas';

    @autoproperty
    id: number = 15;

    @autoproperty
    newsletter: boolean = false;

    @autoproperty
    car: Car;

    @autoproperty
    secondCar: Car;

    @autoproperty
    hobbies: string[] = ['Skiing'];

    @autoproperty
    child: Child;

    constructor() {
        super();
        
        this.car = new Car('Chevrolet');
        this.secondCar = new Car('Toyota');
        this.child = new Child();
    }
}

class Persons extends NotifyPropertyChanged {
    @autoproperty
    persons: Person[];

    constructor() {
        super();

        this.persons = [];
    }
}

describe('propertyChanged', () => {
    it('should fire and reflect changes on strings', (done) => {
        var p = new Person();

        var subscription = p.$propertyChanged.subscribe((args: PropertyChangedEventArgs) => {
            expect(args.propertyName).toBe('name');
            expect(args.oldValue).toBe('Thomas');
            expect(args.newValue).toBe('Helmut');

            subscription.unsubscribe();
            done();
        });

        p.name = 'Helmut';
    });

    it('should fire and reflect changes on numbers', (done) => {
        var p = new Person();

        var subscription = p.$propertyChanged.subscribe((args: PropertyChangedEventArgs) => {
            expect(args.propertyName).toBe('id');
            expect(args.oldValue).toBe(15);
            expect(args.newValue).toBe(16);

            subscription.unsubscribe();
            done();
        });

        p.id = 16;
    });

    it('should fire and reflect changes on booleans', (done) => {
        var p = new Person();

        var subscription = p.$propertyChanged.subscribe((args: PropertyChangedEventArgs) => {
            expect(args.propertyName).toBe('newsletter');
            expect(args.oldValue).toBe(false);
            expect(args.newValue).toBe(true);

            subscription.unsubscribe();
            done();
        });

        p.newsletter = true;
    });

    it('should fire and reflect changes on classes', (done) => {
        var p = new Person();

        var subscription = p.$propertyChanged.subscribe((args: PropertyChangedEventArgsGeneric<Car>) => {
            expect(args.propertyName).toBe('car');
            expect(args.oldValue.make).toBe('Chevrolet');
            expect(args.newValue.make).toBe('Ford');

            subscription.unsubscribe();
            done();
        });

        p.car = new Car('Ford');
    });

    it('should fire and reflect changes on arrays', (done) => {
        var p = new Person();

        var subscription = p.$propertyChanged.subscribe((args: PropertyChangedEventArgsGeneric<Array<string>>) => {
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

    it('should fire and reflect changes on properties of child classes', (done) => {
        var p = new Person();

        var subscription = p.$propertyChanged.subscribe((args: PropertyChangedEventArgsGeneric<Array<string>>) => {
            expect(args.propertyName).toBe('child.name');
            expect(args.newValue).toBe('Florian');
            subscription.unsubscribe();
            done();

        });

        p.child.name = 'Florian';
    });

    it('should fire and reflect changes on classes inside an array', (done) => {
        var pArr = new Persons();
        var p = new Person();

        var subscription = pArr.$propertyChanged.subscribe((args: PropertyChangedEventArgsGeneric<Array<string>>) => {
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

    it('should fire and reflect changes on classes inside an array 2', (done) => {
        var pArr = new Persons();
        var p = new Person();

        var subscription = pArr.$propertyChanged.subscribe((args: PropertyChangedEventArgsGeneric<Array<string>>) => {
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


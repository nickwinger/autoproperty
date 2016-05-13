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

describe('propertyChanged', () => {
    it('should fire and reflect changes on strings', () => {
        var p = new Person();

        var subscription = p.propertyChanged.subscribe((args: PropertyChangedEventArgs) => {
            expect(args.propertyName).toBe('name');
            expect(args.oldValue).toBe('Thomas');
            expect(args.newValue).toBe('Helmut');
        });

        p.name = 'Helmut';

        subscription.unsubscribe();
    });

    it('should fire and reflect changes on numbers', () => {
        var p = new Person();

        var subscription = p.propertyChanged.subscribe((args: PropertyChangedEventArgs) => {
            expect(args.propertyName).toBe('id');
            expect(args.oldValue).toBe(15);
            expect(args.newValue).toBe(16);
        });

        p.id = 16;

        subscription.unsubscribe();
    });

    it('should fire and reflect changes on booleans', () => {
        var p = new Person();

        var subscription = p.propertyChanged.subscribe((args: PropertyChangedEventArgs) => {
            expect(args.propertyName).toBe('newsletter');
            expect(args.oldValue).toBe(false);
            expect(args.newValue).toBe(true);
        });

        p.newsletter = true;

        subscription.unsubscribe();
    });

    it('should fire and reflect changes on classes', () => {
        var p = new Person();

        var subscription = p.propertyChanged.subscribe((args: PropertyChangedEventArgsGeneric<Car>) => {
            expect(args.propertyName).toBe('car');
            expect(args.oldValue.make).toBe('Chevrolet');
            expect(args.newValue.make).toBe('Ford');
        });

        p.car = new Car('Ford');

        subscription.unsubscribe();
    });

    it('should fire and reflect changes on arrays', () => {
        var p = new Person();

        var subscription = p.propertyChanged.subscribe((args: PropertyChangedEventArgsGeneric<Array<string>>) => {
            expect(args.propertyName).toBe('hobbies');
            expect(args.oldValue.length).toBe(1);
            expect(args.oldValue[0]).toBe('Skiing');
            expect(args.newValue.length).toBe(2);
            expect(args.newValue[0]).toBe('Skiing');
            expect(args.newValue[1]).toBe('Driving');
        });

        p.hobbies.push('Driving');

        subscription.unsubscribe();
    });

    it('should fire and reflect changes on properties of child classes', () => {
        var p = new Person();

        var subscription = p.propertyChanged.subscribe((args: PropertyChangedEventArgsGeneric<Array<string>>) => {
            expect(args.propertyName).toBe('child.name');
            expect(args.newValue).toBe('Florian');
        });

        p.child.name = 'Florian';

        subscription.unsubscribe();
    });
});


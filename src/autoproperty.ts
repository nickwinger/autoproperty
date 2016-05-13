import {Subject} from "rxjs";

// Right now there are problems with the rxjs subject going into an infinite loop, so we have to hack our own simple implemention
// for the time beeing

export interface ISimpleSubjectUnsubscribeFn {
    unsubscribe: () => void;
}

export class SimpleSubject<T> {
    listeners: Function[] = [];

    next(value: T) {
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i](value);
        }
    }

    subscribe(listener: (value: T) => void): ISimpleSubjectUnsubscribeFn {
        let index = this.listeners.length;

        this.listeners.push(listener);

        // return unsubscribe function
        return {
            unsubscribe: () => {
                this.listeners.splice(index, 1);
            }
        };
    }
}

//this library can be used in Node or a browser, make sure our global object points to the right place
declare var global : any;

var win : any = null;
try {
    win = window;
}
catch (e) {
    win = global;
}

export class PropertyChangedEventArgsGeneric<T> {
    constructor(public propertyName: string, public oldValue: T, public newValue: T) {
    }
}

export class PropertyChangedEventArgs extends PropertyChangedEventArgsGeneric<any> {
}

export interface INotifyPropertyChanged {
    propertyChanged: SimpleSubject<PropertyChangedEventArgs>;
    onPropertyChanged(name: string, oldValue: any, newValue: any): void;
}

export abstract class NotifyPropertyChanged implements INotifyPropertyChanged {
    propertyChanged: SimpleSubject<PropertyChangedEventArgs>;

    constructor() {
        this.propertyChanged = new SimpleSubject<PropertyChangedEventArgs>();
    }

    onPropertyChanged(name: string, oldValue: any, newValue: any): void {
        this.propertyChanged.next(new PropertyChangedEventArgs(name, oldValue, newValue));
    }
}

// an array the holds the types on which we have already set getter and setters
var typeMap = [];

export function autoproperty<T extends NotifyPropertyChanged>(target: T, keyName: string): any {
    // automagically create a protected member and assign the default value
    var protectedKeyName = '_' + keyName;
    var anyTarget = <any>target;
    anyTarget[protectedKeyName] = anyTarget[keyName];
    var type: string;

    var getterAndSetterAlreadyAdded = false;

    for (var i = 0; i < typeMap.length; i++) {
        if (typeMap[i] === target.constructor['name']) {
            getterAndSetterAlreadyAdded = true;
            break;
        }
    }

    if (getterAndSetterAlreadyAdded) {
        return;
    }

    typeMap.push(target.constructor['name']);

    // automagically create getter and setter
    Object.defineProperty(target, keyName, {
        get: function () {
            var ret = this[protectedKeyName];

            // return an array proxy to intercept the calls to push, pop, shift, unshift and slice
            if (type === '[object Array]') {
                // first create a copy of our array
                var ret = ret.slice();
                var runtimeTarget = this;

                // proxy the 5 standard methods
                ret.push = function() {
                    var oldValue = runtimeTarget[protectedKeyName].slice();
                    var ret = Array.prototype.push.apply(runtimeTarget[protectedKeyName], arguments);
                    runtimeTarget.onPropertyChanged(keyName, oldValue, runtimeTarget[protectedKeyName]);
                    return ret;
                };
                ret.pop = function() {
                    var oldValue = runtimeTarget[protectedKeyName].slice();
                    var ret = Array.prototype.pop.apply(runtimeTarget[protectedKeyName], arguments);
                    runtimeTarget.onPropertyChanged(keyName, oldValue, runtimeTarget[protectedKeyName]);
                    return ret;
                };
                ret.shift = function() {
                    var oldValue = runtimeTarget[protectedKeyName].slice();
                    var ret = Array.prototype.shift.apply(runtimeTarget[protectedKeyName], arguments);
                    runtimeTarget.onPropertyChanged(keyName, oldValue, runtimeTarget[protectedKeyName]);
                    return ret;
                };
                ret.unshift = function() {
                    var oldValue = runtimeTarget[protectedKeyName].slice();
                    var ret = Array.prototype.unshift.apply(runtimeTarget[protectedKeyName], arguments);
                    runtimeTarget.onPropertyChanged(keyName, oldValue, runtimeTarget[protectedKeyName]);
                    return ret;
                };
                ret.slice = function() {
                    var oldValue = runtimeTarget[protectedKeyName].slice();
                    var ret = Array.prototype.slice.apply(runtimeTarget[protectedKeyName], arguments);
                    runtimeTarget.onPropertyChanged(keyName, oldValue, runtimeTarget[protectedKeyName]);
                    return ret;
                };
            }

            return ret;
        },
        set: function (newValue) {
            var oldValue = this[protectedKeyName];
            this[protectedKeyName] = newValue;

            // Determine the type
            type = Object.prototype.toString.call(newValue);

            // if the property itself is a subclass of NotifyPropertyChanged, listen for changes there
            if (newValue instanceof NotifyPropertyChanged) {
                newValue.propertyChanged.subscribe((args: PropertyChangedEventArgs) => {
                    // something changed inside a property that itself is a NotifyPropertyChanged class
                    // prefix the keyName
                    this.onPropertyChanged(keyName + '.' + args.propertyName, args.oldValue, args.newValue);
                });
            }

            if (oldValue != newValue) {
                // Call OnPropertyChanged whenever the property is updated
                this.onPropertyChanged(keyName, oldValue, this[protectedKeyName]);
            }
        },
        enumerable: true,
        configurable: true
    });
}

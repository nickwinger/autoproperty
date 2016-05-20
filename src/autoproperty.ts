import {Subject} from "rxjs";

// Right now there are problems with the rxjs subject going into an infinite loop, so we have to hack our own simple implemention
// for the time beeing

export interface ISimpleSubjectUnsubscribeFn {
    unsubscribe: () => void;
}

export var version = "1.1.6";

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
    $propertyChanged: SimpleSubject<PropertyChangedEventArgs>;
    onPropertyChanged(name: string, oldValue: any, newValue: any): void;
}

export abstract class NotifyPropertyChanged implements INotifyPropertyChanged {
    $propertyChanged: SimpleSubject<PropertyChangedEventArgs>;

    constructor() {
        this.$propertyChanged = new SimpleSubject<PropertyChangedEventArgs>();
    }

    onPropertyChanged(name: string, oldValue: any, newValue: any): void {
        this.$propertyChanged.next(new PropertyChangedEventArgs(name, oldValue, newValue));
    }
}

// an array the holds the types on which we have already set getter and setters
var typeMap = [];

export class ArrayProxy {
    // if there are NotifyPropertyChanged objects in the array, we listen for changes
    // this array holds all the listeners, so we can unsubscribe of not needed anymore
    subscriptions: ISimpleSubjectUnsubscribeFn[];

    constructor(private runtimeTarget: NotifyPropertyChanged, private keyName: string, private protectedKeyName: string, public arr: any[]) {
        // make a copy of the original array
        this.subscriptions = [];
        this.wrapProxy();
    }

    clear() {
        this.unsubscribe();
        this.subscriptions = undefined;
    }

    private unsubscribe(self?: ArrayProxy) {
        if (!self) {
            self = this;
        }

        for (let i = 0; i < self.subscriptions.length; i++) {
            self.subscriptions[i].unsubscribe();
        }
        this.subscriptions = [];
    }

    // Iterates through the array and searched for NotifyPropertyChanged objects to subscribe to
    private subscribe(self: ArrayProxy) {
        // Always unsubscribe everything, and then subscribe again
        self.unsubscribe(self);

        for (let i = 0; i < self.arr.length; i++) {
            var elem = self.arr[i];
            if (elem instanceof NotifyPropertyChanged) {
                let index = i;
                var subscription = elem.$propertyChanged.subscribe((args:PropertyChangedEventArgs) => {
                    // something changed inside a property that itself is a NotifyPropertyChanged class
                    // prefix the keyName
                    self.runtimeTarget.onPropertyChanged(self.keyName + '[' + index + ']' + '.' + args.propertyName, args.oldValue, args.newValue);
                });
                self.subscriptions.push(subscription);
            }
        }
    }

    private wrapProxy() {
        var arrayToProxy = this.arr;
        var self = this;

        // proxy the 5 standard methods
        arrayToProxy['$$push'] = arrayToProxy.push;
        arrayToProxy.push = function () {
            let oldValue = self.runtimeTarget[self.protectedKeyName]['$$slice']();
            let ret = Array.prototype.push.apply(self.runtimeTarget[self.protectedKeyName], arguments);
            self.runtimeTarget.onPropertyChanged(self.keyName, oldValue, self.runtimeTarget[self.protectedKeyName]);
            self.subscribe(self);
            return ret;
        };

        arrayToProxy['$$pop'] = arrayToProxy.pop;
        arrayToProxy.pop = function () {
            let oldValue = self.runtimeTarget[self.protectedKeyName]['$$slice']();
            let ret = Array.prototype.pop.apply(self.runtimeTarget[self.protectedKeyName], arguments);
            self.runtimeTarget.onPropertyChanged(self.keyName, oldValue, self.runtimeTarget[self.protectedKeyName]);
            self.subscribe(self);
            return ret;
        };

        arrayToProxy['$$shift'] = arrayToProxy.shift;
        arrayToProxy.shift = function () {
            let oldValue = self.runtimeTarget[self.protectedKeyName]['$$slice']();
            let ret = Array.prototype.shift.apply(self.runtimeTarget[self.protectedKeyName], arguments);
            self.runtimeTarget.onPropertyChanged(self.keyName, oldValue, self.runtimeTarget[self.protectedKeyName]);
            self.subscribe(self);
            return ret;
        };

        arrayToProxy['$$unshift'] = arrayToProxy.unshift;
        arrayToProxy.unshift = function () {
            let oldValue = self.runtimeTarget[self.protectedKeyName]['$$slice']();
            let ret = Array.prototype.unshift.apply(self.runtimeTarget[self.protectedKeyName], arguments);
            self.runtimeTarget.onPropertyChanged(self.keyName, oldValue, self.runtimeTarget[self.protectedKeyName]);
            self.subscribe(self);
            return ret;
        };

        arrayToProxy['$$slice'] = arrayToProxy.slice;
        arrayToProxy.slice = function () {
            let oldValue = self.runtimeTarget[self.protectedKeyName]['$$slice']();
            let ret = Array.prototype.slice.apply(self.runtimeTarget[self.protectedKeyName], arguments);
            self.runtimeTarget.onPropertyChanged(self.keyName, oldValue, self.runtimeTarget[self.protectedKeyName]);
            self.subscribe(self);
            return ret;
        };
    }
}

export function autoproperty<T extends NotifyPropertyChanged>(target: T, keyName: string): any {
    // automagically create a protected member and assign the default value
    var protectedKeyName = '$' + keyName;
    var anyTarget = <any>target;
    anyTarget[protectedKeyName] = anyTarget[keyName];
    var type: string;
    var typeMapHash = target.constructor['name'] + '.' + keyName;
    var getterProxyKey: string = '$$getterProxy';

    /*var getterAndSetterAlreadyAdded = false;

    for (var i = 0; i < typeMap.length; i++) {
        if (typeMap[i] === typeMapHash) {
            getterAndSetterAlreadyAdded = true;
            break;
        }
    }

    if (getterAndSetterAlreadyAdded) {
        return;
    }

    typeMap.push(typeMapHash);*/

    // automagically create getter and setter
    Object.defineProperty(target, keyName, {
        get: function () {
            let ret = this[protectedKeyName];

            // return an array proxy to intercept the calls to push, pop, shift, unshift and slice
            if (type === '[object Array]') {
                if (!this[getterProxyKey]) {
                    this[getterProxyKey] = new ArrayProxy(this, keyName, protectedKeyName, ret);
                }
                
                ret = this[getterProxyKey].arr;
            }

            return ret;
        },
        set: function (newValue) {
            var oldValue = this[protectedKeyName];
            this[protectedKeyName] = newValue;

            // Determine the type
            type = Object.prototype.toString.call(newValue);

            // When assigning a new array, reset the getterProxy
            if (type === '[object Array]') {
                if (this[getterProxyKey]) {
                    this[getterProxyKey].clear();
                    this[getterProxyKey] = undefined;
                }
            }

            // if the property itself is a subclass of NotifyPropertyChanged, listen for changes there
            if (newValue instanceof NotifyPropertyChanged) {
                newValue.$propertyChanged.subscribe((args: PropertyChangedEventArgs) => {
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

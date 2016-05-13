import {Subject} from "rxjs";

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
    propertyChanged: Subject<PropertyChangedEventArgs>;
    onPropertyChanged(name: string, oldValue: any, newValue: any): void;
}

export abstract class NotifyPropertyChanged implements INotifyPropertyChanged {
    propertyChanged: Subject<PropertyChangedEventArgs>;

    constructor() {
        this.propertyChanged = new Subject<PropertyChangedEventArgs>();
    }

    onPropertyChanged(name: string, oldValue: any, newValue: any): void {
        this.propertyChanged.next(new PropertyChangedEventArgs(name, oldValue, newValue));
    }
}

function extendArray<T extends NotifyPropertyChanged>(target: T, keyName: string) {
    var protectedKeyName = '_' + keyName;
    var anyTarget = <any>target;
    var arr = anyTarget[protectedKeyName];

    arr.push = function () {console.log('push', arguments);
        var oldValue = this.slice();
        var ret = Array.prototype.push.apply(this, arguments);
        target.onPropertyChanged(keyName, oldValue, this);
        return ret;
    };
}

export function autoproperty<T extends NotifyPropertyChanged>(target: T, keyName: string): any {
    // automagically create a protected member and assign the default value
    var protectedKeyName = '_' + keyName;
    var anyTarget = <any>target;
    anyTarget[protectedKeyName] = anyTarget[keyName];
    var type: string;

    var setType = (newType: string, runtimeTarget: any) => {
        type = newType;

        // arrays need to be extended
        if (type === '[object Array]') {
            extendArray(runtimeTarget, keyName);
        }
    };

    // automagically create getter and setter
    Object.defineProperty(target, keyName, {
        get: function () { return this[protectedKeyName]; },
        set: function (newValue) {
            var oldValue = this[protectedKeyName];
            this[protectedKeyName] = newValue;
            // Call OnPropertyChanged whenever the property is updated
            this.onPropertyChanged(keyName, oldValue, newValue);

            // Determine the type
            var currentType = Object.prototype.toString.call(newValue);
            if (currentType != type) {
                //setType(currentType, this);
                type = currentType;

                // arrays need to be extended
                if (type === '[object Array]') {
                    var arr = this[protectedKeyName];
                    console.log('new', arr);
                    arr.push('try');

                    arr.push = function () {console.log('push', arguments);
                        var oldValue = this;
                        var ret = Array.prototype.push.apply(this, arguments);
                        target.onPropertyChanged(keyName, oldValue, this);
                        return ret;
                    };
                }
            }
        },
        enumerable: true,
        configurable: true
    });
}

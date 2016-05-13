import { Subject } from "rxjs";
export declare class PropertyChangedEventArgsGeneric<T> {
    propertyName: string;
    oldValue: T;
    newValue: T;
    constructor(propertyName: string, oldValue: T, newValue: T);
}
export declare class PropertyChangedEventArgs extends PropertyChangedEventArgsGeneric<any> {
}
export interface INotifyPropertyChanged {
    propertyChanged: Subject<PropertyChangedEventArgs>;
    onPropertyChanged(name: string, oldValue: any, newValue: any): void;
}
export declare abstract class NotifyPropertyChanged implements INotifyPropertyChanged {
    propertyChanged: Subject<PropertyChangedEventArgs>;
    constructor();
    onPropertyChanged(name: string, oldValue: any, newValue: any): void;
}
export declare function autoproperty<T extends NotifyPropertyChanged>(target: T, keyName: string): any;

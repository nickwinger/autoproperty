export interface ISimpleSubjectUnsubscribeFn {
    unsubscribe: () => void;
}
export declare class SimpleSubject<T> {
    listeners: Function[];
    next(value: T): void;
    subscribe(listener: (value: T) => void): ISimpleSubjectUnsubscribeFn;
}
export declare class PropertyChangedEventArgsGeneric<T> {
    propertyName: string;
    oldValue: T;
    newValue: T;
    constructor(propertyName: string, oldValue: T, newValue: T);
}
export declare class PropertyChangedEventArgs extends PropertyChangedEventArgsGeneric<any> {
}
export interface INotifyPropertyChanged {
    propertyChanged: SimpleSubject<PropertyChangedEventArgs>;
    onPropertyChanged(name: string, oldValue: any, newValue: any): void;
}
export declare abstract class NotifyPropertyChanged implements INotifyPropertyChanged {
    propertyChanged: SimpleSubject<PropertyChangedEventArgs>;
    constructor();
    onPropertyChanged(name: string, oldValue: any, newValue: any): void;
}
export declare function autoproperty<T extends NotifyPropertyChanged>(target: T, keyName: string): any;

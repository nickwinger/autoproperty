# autoproperty
Reactive, non dirty checking Change-Detection for mutable objects

## Problem
How to fast detect if a property of a class changed it's value ?
```typescript
    class Person {
        name: string;
    }

    var p = new Person();
    p.name = 'John';

    // There is no way we can get informed that the name has changed
```

## Example
Using typescript annotations, we automagically create getter and setter out of a normal property to detect changes in the setter and feed a subject which can be subscribed to.
```typescript
    import {autoproperty, NotifyPropertyChanged, PropertyChangedEventArgs, PropertyChangedEventArgsGeneric} from 'autoproperty';

    class Person extends NotifyPropertyChanged {
        @autoproperty
        name: string;
    }

    var p = new Person();
    p.name = 'John';

    p.$propertyChanged.subscribe((args: PropertyChangedEventArgs) => {
        console.log(args.propertyName + ' changed from ' + args.oldValue + ' to ' + args.newValue);
    });
```

## Under the hood
What has been done by the autoproperty annotation ?

This:
```typescript
    class Person extends NotifyPropertyChanged {
        @autoproperty
        name: string;
    }
```
gets transformed into:
```typescript
    class Person extends NotifyPropertyChanged {
        $name: string;

        get name(): string {
            return this.$name;
        }

        set name(newValue: string) {
            var oldValue = this.$name;
            this.$name = newValue;
            this.propertyChanged.next('name', oldValue, newValue);
        }
    }
```
Getter and setter and a "hidden" field are automagically created.

## Manually creating a setter that feeds the propertyChanged stream
If you already have a setter or want to manually create one and want the propertyChanged stream to notify just feed the
stream like this:
```typescript
    this.onPropertyChanged(<keyName>, <oldValue>, <newValue>);
```
Replacing keyName with the name of the setter, oldValue with the previous Values and newValue with the new value.

# Restrictions (and ToDo's)
* Resursive. An autoproperty cannot have itself as a property (endless loop of typescript annotation)


## Build and run tests
1. run `npm install` to install all dependencies
2. run `npm run tsc` to run the typescript compiler
3. run `npm run test` to run the jasmine tests
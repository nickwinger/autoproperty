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

    p.propertyChanged.subscribe((args: PropertyChangedEventArgs) => {
        console.log(args.propertyName + ' changed from ' + args.oldValue + ' to ' + args.newValue);
    });

```

# Restrictions (and ToDo's)
* Resursive. An autoproperty cannot have itself as a property (endless loop of typescript annotation)
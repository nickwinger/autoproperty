"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rxjs_1 = require("rxjs");
var win = null;
try {
    win = window;
}
catch (e) {
    win = global;
}
var PropertyChangedEventArgsGeneric = (function () {
    function PropertyChangedEventArgsGeneric(propertyName, oldValue, newValue) {
        this.propertyName = propertyName;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
    return PropertyChangedEventArgsGeneric;
}());
exports.PropertyChangedEventArgsGeneric = PropertyChangedEventArgsGeneric;
var PropertyChangedEventArgs = (function (_super) {
    __extends(PropertyChangedEventArgs, _super);
    function PropertyChangedEventArgs() {
        _super.apply(this, arguments);
    }
    return PropertyChangedEventArgs;
}(PropertyChangedEventArgsGeneric));
exports.PropertyChangedEventArgs = PropertyChangedEventArgs;
var NotifyPropertyChanged = (function () {
    function NotifyPropertyChanged() {
        this.propertyChanged = new rxjs_1.Subject();
    }
    NotifyPropertyChanged.prototype.onPropertyChanged = function (name, oldValue, newValue) {
        this.propertyChanged.next(new PropertyChangedEventArgs(name, oldValue, newValue));
    };
    return NotifyPropertyChanged;
}());
exports.NotifyPropertyChanged = NotifyPropertyChanged;
function extendArray(target, keyName) {
    var protectedKeyName = '_' + keyName;
    var anyTarget = target;
    var arr = anyTarget[protectedKeyName];
    arr.push = function () {
        console.log('push', arguments);
        var oldValue = this.slice();
        var ret = Array.prototype.push.apply(this, arguments);
        target.onPropertyChanged(keyName, oldValue, this);
        return ret;
    };
}
function autoproperty(target, keyName) {
    var protectedKeyName = '_' + keyName;
    var anyTarget = target;
    anyTarget[protectedKeyName] = anyTarget[keyName];
    var type;
    var setType = function (newType, runtimeTarget) {
        type = newType;
        if (type === '[object Array]') {
            extendArray(runtimeTarget, keyName);
        }
    };
    Object.defineProperty(target, keyName, {
        get: function () { return this[protectedKeyName]; },
        set: function (newValue) {
            var oldValue = this[protectedKeyName];
            this[protectedKeyName] = newValue;
            this.onPropertyChanged(keyName, oldValue, newValue);
            var currentType = Object.prototype.toString.call(newValue);
            if (currentType != type) {
                type = currentType;
                if (type === '[object Array]') {
                    var arr = this[protectedKeyName];
                    console.log('new', arr);
                    arr.push('try');
                    arr.push = function () {
                        console.log('push', arguments);
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
exports.autoproperty = autoproperty;

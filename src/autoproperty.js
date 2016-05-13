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
function autoproperty(target, keyName) {
    var protectedKeyName = '_' + keyName;
    var anyTarget = target;
    anyTarget[protectedKeyName] = anyTarget[keyName];
    var type;
    Object.defineProperty(target, keyName, {
        get: function () {
            var ret = this[protectedKeyName];
            if (type === '[object Array]') {
                var ret = ret.slice();
                var runtimeTarget = this;
                ret.push = function () {
                    var oldValue = runtimeTarget[protectedKeyName].slice();
                    var ret = Array.prototype.push.apply(runtimeTarget[protectedKeyName], arguments);
                    runtimeTarget.onPropertyChanged(keyName, oldValue, runtimeTarget[protectedKeyName]);
                    return ret;
                };
                ret.pop = function () {
                    var oldValue = runtimeTarget[protectedKeyName].slice();
                    var ret = Array.prototype.pop.apply(runtimeTarget[protectedKeyName], arguments);
                    runtimeTarget.onPropertyChanged(keyName, oldValue, runtimeTarget[protectedKeyName]);
                    return ret;
                };
                ret.shift = function () {
                    var oldValue = runtimeTarget[protectedKeyName].slice();
                    var ret = Array.prototype.shift.apply(runtimeTarget[protectedKeyName], arguments);
                    runtimeTarget.onPropertyChanged(keyName, oldValue, runtimeTarget[protectedKeyName]);
                    return ret;
                };
                ret.unshift = function () {
                    var oldValue = runtimeTarget[protectedKeyName].slice();
                    var ret = Array.prototype.unshift.apply(runtimeTarget[protectedKeyName], arguments);
                    runtimeTarget.onPropertyChanged(keyName, oldValue, runtimeTarget[protectedKeyName]);
                    return ret;
                };
                ret.slice = function () {
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
            type = Object.prototype.toString.call(newValue);
            this.onPropertyChanged(keyName, oldValue, this[protectedKeyName]);
        },
        enumerable: true,
        configurable: true
    });
}
exports.autoproperty = autoproperty;

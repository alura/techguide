"use strict";
/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJSDate = exports.validateUnixTimestamp = exports.validateDateTime = exports.validateDate = exports.validateTime = void 0;
// Check whether a certain year is a leap year.
//
// Every year that is exactly divisible by four
// is a leap year, except for years that are exactly
// divisible by 100, but these centurial years are
// leap years if they are exactly divisible by 400.
// For example, the years 1700, 1800, and 1900 are not leap years,
// but the years 1600 and 2000 are.
//
const leapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
// Function that checks whether a time-string is RFC 3339 compliant.
//
// It checks whether the time-string is structured in one of the
// following formats:
//
// - hh:mm:ssZ
// - hh:mm:ss±hh:mm
// - hh:mm:ss.*sZ
// - hh:mm:ss.*s±hh:mm
//
// Where *s is a fraction of seconds with at least 1 digit.
//
// Note, this validator assumes that all minutes have
// 59 seconds. This assumption does not follow RFC 3339
// which includes leap seconds (in which case it is possible that
// there are 60 seconds in a minute).
//
// Leap seconds are ignored because it adds complexity in
// the following areas:
// - The native Javascript Date ignores them; i.e. Date.parse('1972-12-31T23:59:60Z')
//   equals NaN.
// - Leap seconds cannot be known in advance.
//
const validateTime = (time) => {
    time = time === null || time === void 0 ? void 0 : time.toUpperCase();
    const TIME_REGEX = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.\d{1,})?(([Z])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/;
    return TIME_REGEX.test(time);
};
exports.validateTime = validateTime;
// Function that checks whether a date-string is RFC 3339 compliant.
//
// It checks whether the date-string is a valid date in the YYYY-MM-DD.
//
// Note, the number of days in each date are determined according to the
// following lookup table:
//
// Month Number  Month/Year           Maximum value of date-mday
// ------------  ----------           --------------------------
// 01            January              31
// 02            February, normal     28
// 02            February, leap year  29
// 03            March                31
// 04            April                30
// 05            May                  31
// 06            June                 30
// 07            July                 31
// 08            August               31
// 09            September            30
// 10            October              31
// 11            November             30
// 12            December             31
//
const validateDate = (datestring) => {
    const RFC_3339_REGEX = /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]))$/;
    if (!RFC_3339_REGEX.test(datestring)) {
        return false;
    }
    // Verify the correct number of days for
    // the month contained in the date-string.
    const year = Number(datestring.substr(0, 4));
    const month = Number(datestring.substr(5, 2));
    const day = Number(datestring.substr(8, 2));
    switch (month) {
        case 2: // February
            if (leapYear(year) && day > 29) {
                return false;
            }
            else if (!leapYear(year) && day > 28) {
                return false;
            }
            return true;
        case 4: // April
        case 6: // June
        case 9: // September
        case 11: // November
            if (day > 30) {
                return false;
            }
            break;
    }
    return true;
};
exports.validateDate = validateDate;
// Function that checks whether a date-time-string is RFC 3339 compliant.
//
// It checks whether the time-string is structured in one of the
//
// - YYYY-MM-DDThh:mm:ssZ
// - YYYY-MM-DDThh:mm:ss±hh:mm
// - YYYY-MM-DDThh:mm:ss.*sZ
// - YYYY-MM-DDThh:mm:ss.*s±hh:mm
//
// Where *s is a fraction of seconds with at least 1 digit.
//
const validateDateTime = (dateTimeString) => {
    dateTimeString = dateTimeString === null || dateTimeString === void 0 ? void 0 : dateTimeString.toUpperCase();
    const RFC_3339_REGEX = /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60))(\.\d{1,})?(([Z])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/;
    // Validate the structure of the date-string
    if (!RFC_3339_REGEX.test(dateTimeString)) {
        return false;
    }
    // Check if it is a correct date using the javascript Date parse() method.
    const time = Date.parse(dateTimeString);
    if (time !== time) {
        // eslint-disable-line
        return false;
    }
    // Split the date-time-string up into the string-date and time-string part.
    // and check whether these parts are RFC 3339 compliant.
    const index = dateTimeString.indexOf('T');
    const dateString = dateTimeString.substr(0, index);
    const timeString = dateTimeString.substr(index + 1);
    return (0, exports.validateDate)(dateString) && (0, exports.validateTime)(timeString);
};
exports.validateDateTime = validateDateTime;
// Function that checks whether a given number is a valid
// Unix timestamp.
//
// Unix timestamps are signed 32-bit integers. They are interpreted
// as the number of seconds since 00:00:00 UTC on 1 January 1970.
//
const validateUnixTimestamp = (timestamp) => {
    const MAX_INT = 2147483647;
    const MIN_INT = -2147483648;
    return (timestamp === timestamp && timestamp <= MAX_INT && timestamp >= MIN_INT); // eslint-disable-line
};
exports.validateUnixTimestamp = validateUnixTimestamp;
// Function that checks whether a javascript Date instance
// is valid.
//
const validateJSDate = (date) => {
    const time = date.getTime();
    return time === time; // eslint-disable-line
};
exports.validateJSDate = validateJSDate;

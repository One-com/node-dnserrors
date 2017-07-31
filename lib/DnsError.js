var createError = require('createerror');
var httpErrors = require('httperrors');
var dnsErrorCodesMap = require('./dnsErrorCodesMap');
var defaults = require('lodash.defaults');
var omit = require('lodash.omit');

var DnsError = module.exports = createError({
    name: 'DnsError',
    preprocess: function (err) {
        if (!(err instanceof DnsError)) {
            if (typeof err === 'string') {
                return new DnsError[err]();
            } else if (err && err.code && DnsError.hasOwnProperty(err.code)) {
                return new DnsError[err.code](err);
            }
            // else return generic DnsError
        }
    }
});

DnsError.supports = function (errorOrErrorCode) {
    if (typeof errorOrErrorCode === 'string') {
        return dnsErrorCodesMap.hasOwnProperty(errorOrErrorCode);
    } else if (errorOrErrorCode && errorOrErrorCode.code) {
        return dnsErrorCodesMap.hasOwnProperty(errorOrErrorCode.code);
    } else {
        return false;
    }
};

// create a new DNS error for each error code
Object.keys(dnsErrorCodesMap).forEach(function (errorCode) {
    var statusCode = dnsErrorCodesMap[errorCode] || 'Unknown';
    var options = defaults({
        name: errorCode,
        code: errorCode,
        statusCode: statusCode,
        status: statusCode,
        http: false,
        HttpError: false,
        message: errorCode + ' (DNS)'
    }, omit(httpErrors(statusCode), 'message'));

    DnsError[errorCode] = createError(options, DnsError);
});

// For backwards compatibility:
DnsError.DnsError = DnsError;

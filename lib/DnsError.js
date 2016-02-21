var createError = require('createerror');
var httpErrors = require('httperrors');
var dnsErrorCodesMap = require('./dnsErrorCodesMap');
var _ = require('lodash');

var DnsError = module.exports = createError({
    name: 'DnsError',
    preprocess: function (err) {
        if (!(err instanceof DnsError)) {
            if (err && err.code) {
                var errorName;
                if (DnsError.hasOwnProperty(err.code)) {
                    errorName = err.code;
                } else {
                    errorName = 'NotDnsError';
                }
                return new DnsError[errorName](err);
            } else {
                return new DnsError.NotDnsError(err);
            }
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

function createDnsError(errorCode) {
    var statusCode = dnsErrorCodesMap[errorCode] || 'Unknown';
    var options = _.defaults({
        name: errorCode,
        code: errorCode,
        statusCode: statusCode,
        status: statusCode
    }, _.omit(httpErrors(statusCode), 'message'));
    DnsError[errorCode] = createError(options, DnsError);

    return DnsError[errorCode];
}

// create an Unknown error sentinel
DnsError.NotDnsError = createDnsError('NotDnsError');

// For backwards compatibility:
DnsError.DnsError = DnsError;

// create a new DNS error for each error code
Object.keys(dnsErrorCodesMap).forEach(createDnsError);

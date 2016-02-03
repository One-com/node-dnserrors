var createError = require('createerror');
var httpErrors = require('httperrors');
var dnsErrorCodesMap = require('./dnsErrorCodesMap');
var _ = require('lodash');

var DnsError = module.exports = createError({ name: 'DnsError' });

function createDnsError(errorCode) {
    var statusCode = dnsErrorCodesMap[errorCode] || 'Unknown';

    var options = _.defaults({
        name: errorCode,
        code: errorCode,
        statusCode: statusCode,
        status: statusCode
    }, _.omit(httpErrors(statusCode), 'message'));

    var dnsError = createError(options, DnsError);

    dnsErrors[errorCode] = dnsError;

    return dnsError;
}

var dnsErrors = module.exports = function (err) {
    var errorName;

    if (dnsErrors.hasOwnProperty(err.code)) {
        errorName = err.code;
    } else {
        errorName = 'NotDnsError';
    }

    return new dnsErrors[errorName](err);
};

module.exports = DnsError;

// create an Unknown error sentinel
dnsErrors.NotDnsError = createDnsError('NotDnsError');

// create a new DNS error for each error code
Object.keys(dnsErrorCodesMap).forEach(createDnsError);

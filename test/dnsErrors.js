/*global describe, it*/
var expect = require('unexpected');
var httpErrors = require('httperrors');
var dns = require('dns');
var dnsErrorCodesMap = require('../lib/dnsErrorCodesMap');
var dnsErrors = require('../lib/dnsErrors');

describe('dnsErrors', function () {

    it('will create a properly subclassed instance', function (done) {
        // capture a genuine NOTFOUND error
        dns.lookup('i.really.do.not.exist.vqweuvqwuevqhwieuvhqwkevåjqkrv23jkvewqjvkjqwiouvedjkqwiuvehqwev.com', function (err) {
            expect(err, 'to be truthy');
            expect(err.code, 'to equal', 'ENOTFOUND');
            var dnsError = dnsErrors(err);
            var httpError = new httpErrors[404]();

            expect(dnsError, 'to equal', new dnsErrors[err.code](err));

            // has the original error propeties
            expect(dnsError, 'to have properties', Object.keys(err));

            // has the httpError properties
            expect(dnsError, 'to have properties', Object.keys(httpError));

            // has named errorCode property
            expect(dnsError[err.code], 'to be true');

            expect(dnsError, 'to be a', dnsErrors.DnsError);

            done();
        });
    });

    it('will return unknown error if it was not mapped', function () {
        var err = new Error();
        var dnsError = dnsErrors(err);

        expect(dnsError, 'to equal', new dnsErrors.NotDnsError());

        // has named errorCode property
        expect(dnsError.NotDnsError, 'to be true');
    });

    it('will not alter the original error', function () {
        var err = new Error();
        err.code = 'ECONNREFUSED';
        var dnsError = dnsErrors(err);

        // assert dnsError was altered
        expect(dnsError, 'to equal', new dnsErrors[err.code](err));

        // assert orignal err was untouched
        expect(err, 'not to have properties', ['statusCode']);
    });

    // check the various error codes will be transformed correctly
    Object.keys(dnsErrorCodesMap).forEach(function (errorCode) {
        var statusCode = dnsErrorCodesMap[errorCode];

        describe(errorCode, function () {
            it('is correctly instantiated', function () {
                var err = new Error();
                err.code = errorCode;
                var dnsError = dnsErrors(err);

                expect(dnsError, 'to equal', new dnsErrors[errorCode](err));

                // has named errorCode property
                expect(dnsError[errorCode], 'to be true');
            });

            it('returns a ' + statusCode, function () {
                var dnsError = dnsErrors((function () {
                    var err = new Error();
                    err.code = errorCode;
                    return err;
                })());

                expect(dnsError.statusCode, 'to equal', statusCode);
            });

            it('lets the `code` from the original instance take precedence over the one built into the class', function () {
                var err = new Error();
                err.code = 'SOMETHINGELSE';
                var dnsError = dnsErrors(err);

                expect(dnsError.code, 'to equal', 'SOMETHINGELSE');
            });

            describe('when instantiated via the constructor', function () {
                it('has a `code` property', function () {
                    expect(new dnsErrors[errorCode]().code, 'to equal', errorCode);
                });
            });
        });
    });

});

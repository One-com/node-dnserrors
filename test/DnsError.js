/*global describe, it*/
var expect = require('unexpected');
var httpErrors = require('httperrors');
var dns = require('dns');
var dnsErrorCodesMap = require('../lib/dnsErrorCodesMap');
var DnsError = require('../lib/DnsError');
var dnsErrorConstructorInLowerCase = DnsError;

describe('DnsError', function () {
    it('works as a constructor', function () {
        expect(new DnsError('ENOTFOUND'), 'to be a', DnsError);
    });

    it('works without new', function () {
        expect(dnsErrorConstructorInLowerCase('ENOTFOUND'), 'to be a', DnsError);
    });

    it('will create a properly subclassed instance', function (done) {
        // capture a genuine NOTFOUND error
        dns.lookup('i.really.do.not.exist.vqweuvqwuevqhwieuvhqwkevåjqkrv23jkvewqjvkjqwiouvedjkqwiuvehqwev.com', function (err) {
            expect(err, 'to be truthy');
            expect(err.code, 'to equal', 'ENOTFOUND');
            var dnsError = dnsErrorConstructorInLowerCase(err);
            var httpError = new httpErrors[404]();

            expect(dnsError, 'to equal', new DnsError[err.code](err));

            // has the original error propeties
            expect(dnsError, 'to have properties', Object.keys(err));

            // has the httpError properties
            expect(dnsError, 'to have properties', Object.keys(httpError));

            // has named errorCode property
            expect(dnsError[err.code], 'to be true');

            expect(dnsError, 'to be a', DnsError.DnsError);

            done();
        });
    });

    it('will return a generic DnsError if it was not mapped', function () {
        var err = new Error();
        var dnsError = new DnsError(err);

        expect(dnsError, 'to equal', new DnsError());
    });

    it('will not alter the original error', function () {
        var err = new Error();
        err.code = 'ECONNREFUSED';
        var dnsError = new DnsError(err);

        // assert dnsError was altered
        expect(dnsError, 'to equal', new DnsError[err.code](err));

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
                var dnsError = dnsErrorConstructorInLowerCase(err);

                expect(dnsError, 'to equal', new DnsError[errorCode](err));

                // has named errorCode property
                expect(dnsError[errorCode], 'to be true');
            });

            it('returns a ' + statusCode, function () {
                var dnsError = dnsErrorConstructorInLowerCase((function () {
                    var err = new Error();
                    err.code = errorCode;
                    return err;
                })());

                expect(dnsError.statusCode, 'to equal', statusCode);
            });

            it('lets the `code` from the original instance take precedence over the one built into the class', function () {
                var err = new Error();
                err.code = 'SOMETHINGELSE';
                var dnsError = dnsErrorConstructorInLowerCase(err);

                expect(dnsError.code, 'to equal', 'SOMETHINGELSE');
            });

            describe('when instantiated via the constructor', function () {
                it('has a `code` property', function () {
                    expect(new DnsError[errorCode]().code, 'to equal', errorCode);
                });
            });
        });
    });

    it('has the DnsError superclass constructor as the main export', function () {
        expect(new DnsError.ENOENT(), 'to be a', DnsError);
    });

    it('should create an instance via DnsError(errorCode)', function () {
        expect(dnsErrorConstructorInLowerCase('ENOENT'), 'to be a', DnsError.ENOENT);
    });

    describe('#supports', function () {
        it('should return true for a mapped DNS error code', function () {
            expect(DnsError.supports('ENOENT'), 'to be true');
        });

        it('should return false for an unmapped DNS error code', function () {
            expect(DnsError.supports('FOOBAR'), 'to be false');
        });

        it('should return true for a unmapped DNS error instance', function () {
            var fakeDnsError = new Error('ENOENT');
            fakeDnsError.code = 'ENOENT';
            expect(DnsError.supports(fakeDnsError), 'to be true');
        });

        it('should return false for a unmapped DNS error instance', function () {
            var fakeDnsError = new Error('FOOBAR');
            fakeDnsError.code = 'FOOBAR';
            expect(DnsError.supports(fakeDnsError), 'to be false');
        });
    });

    it('should produce instances that have a falsy http property, despite being inherited from HttpError', function () {
        expect(new DnsError.ENOENT().http, 'to be falsy');
    });

    it('should produce instances that have a falsy HttpError property, despite being inherited from HttpError', function () {
        expect(new DnsError.ENOENT().HttpError, 'to be falsy');
    });
});

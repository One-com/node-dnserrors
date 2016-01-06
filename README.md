node-dnserrors
==============

[![NPM version](https://badge.fury.io/js/dnserrors.svg)](http://badge.fury.io/js/dnserrors)
[![Build Status](https://travis-ci.org/One-com/node-dnserrors.svg?branch=master)](https://travis-ci.org/One-com/node-dnserrors)
[![Coverage Status](https://coveralls.io/repos/One-com/node-dnserrors/badge.svg)](https://coveralls.io/r/One-com/node-dnserrors)
[![Dependency Status](https://david-dm.org/One-com/node-dnserrors.svg)](https://david-dm.org/One-com/dnserrors)

Exposes a function mapping DNS errors to DnsError objects.

The defined DnsError objects are created via
<a href="https://github.com/One-com/node-createerror">createerror</a>.

Installation
------------

Make sure you have node.js and npm installed, then run:

    npm install dnserrors

Usage
-----

The primary use case is wrapping errors originating from dns operations:

    var dns = require('dns');
    var dnsErrors = require('dnserrors');

    dns.lookup('qovwiejiqvwiejvoqwevqwev.com', function (err) {
        var dnsError = dnsErrors(err);

        console.warn(dnsError.toString()); // ENOTFOUND: getaddrinfo ENOTFOUND
    });


Other errors will be marked as not being dns errors:

    var dnsErrors = require('dnserrors');

    var err = new Error();
    var dnsError = dnsErrors(err);

    if (dnsError.NotDnsError) {
        // what am I?
    }

Mappings
--------

The following is a list of dns errors mapped by this module:

* ENODATA (mapped to 404)
* EFORMERR (mapped to 400)
* ESERVFAIL (mapped to 502)
* ENOTFOUND (mapped to 404)
* ENOENT (mapped to 404)
* ENOTIMP (mapped to 501)
* EREFUSED (mapped to 403)
* EBADQUERY (mapped to 400)
* EBADNAME (mapped to 400)
* EBADFAMILY (mapped to 400)
* EBADRESP (mapped to 502)
* ECONNREFUSED (mapped to 502)
* ETIMEOUT (mapped to 504)
* EEOF (mapped to 500)
* EFILE (mapped to 500)
* ENOMEM (mapped to 500)
* EDESTRUCTION (mapped to 500)
* EBADSTR (mapped to 400)
* EBADFLAGS (mapped to 400)
* ENONAME (mapped to 400)
* EBADHINTS (mapped to 400)
* ENOTINITIALIZED (mapped to 500)
* ELOADIPHLPAPI (mapped to 500)
* EADDRGETNETWORKPARAMS (mapped to 500)
* ECANCELLED (mapped to 500)

License
-------

3-clause BSD license -- see the `LICENSE` file for details.

/*
 * meocloud
 * http://github.com/rogeriopvl/node-meocloud
 *
 * Copyright (c) 2013 Rogério Vicente
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request');

module.exports = function(config) {

    var ENDPOINT = 'https://api.meocloud.pt';
    var CONTENT_ENDPOINT = 'https://content-api.meocloud.pt';

    var metadata = function(path, query, cb) {
        var options = {
            uri: ENDPOINT + '/1/Metadata/meocloud/test',
            method: 'GET',
            timeout: 0
        };
        request(options, function(err, response, body) {
            return cb(err, JSON.parse(body));
        });
    };

    return {
        metadata: metadata
    };
};
